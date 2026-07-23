import { Router, type IRouter, type Request, type Response } from "express";
import { desc, count, eq } from "drizzle-orm";
import { db, productsTable, categoriesTable, ordersTable, orderItemsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/store/summary", async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as number;

  const [productCount, categoryCount, orderCount, recentOrders] = await Promise.all([
    db.select({ count: count() }).from(productsTable),
    db.select({ count: count() }).from(categoriesTable),
    db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.userId, userId)),
    db.select().from(ordersTable).where(eq(ordersTable.userId, userId)).orderBy(desc(ordersTable.createdAt)).limit(3),
  ]);

  const recentOrdersWithItems = await Promise.all(
    recentOrders.map(async (order) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          priceAtPurchase: parseFloat(String(item.priceAtPurchase)),
          quantity: item.quantity,
          imageUrl: item.productImageUrl,
        })),
        total: parseFloat(String(order.total)),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    })
  );

  res.json({
    totalProducts: productCount[0].count,
    totalCategories: categoryCount[0].count,
    totalOrders: orderCount[0].count,
    recentOrders: recentOrdersWithItems,
  });
});

export default router;
