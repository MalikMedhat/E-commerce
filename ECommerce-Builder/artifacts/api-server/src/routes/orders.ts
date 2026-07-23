import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, cartsTable, cartItemsTable, productsTable } from "@workspace/db";
import { GetOrderParams, CancelOrderParams, CheckoutBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function buildOrderResponse(order: typeof ordersTable.$inferSelect) {
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

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
}

router.get("/orders", async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as number;
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(desc(ordersTable.createdAt));

  const result = await Promise.all(orders.map(buildOrderResponse));
  res.json(result);
});

router.post("/orders/checkout", async (req: Request, res: Response): Promise<void> => {
  const parsed = CheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req as any).userId as number;

  const [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, userId));
  if (!cart) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const cartItems = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      price: productsTable.price,
      name: productsTable.name,
      imageUrl: productsTable.imageUrl,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.cartId, cart.id));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + parseFloat(String(item.price)) * item.quantity, 0);

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      status: "PENDING",
      total: total.toFixed(2),
      shippingAddress: parsed.data.shippingAddress,
    })
    .returning();

  await db.insert(orderItemsTable).values(
    cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      productImageUrl: item.imageUrl,
      priceAtPurchase: item.price,
      quantity: item.quantity,
    }))
  );

  // Clear the cart
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));

  const response = await buildOrderResponse(order);
  res.status(201).json(response);
});

router.get("/orders/:id", async (req: Request, res: Response): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as any).userId as number;
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order || order.userId !== userId) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const response = await buildOrderResponse(order);
  res.json(response);
});

router.put("/orders/:id/cancel", async (req: Request, res: Response): Promise<void> => {
  const params = CancelOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as any).userId as number;
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order || order.userId !== userId) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (!["PENDING", "PAID"].includes(order.status)) {
    res.status(400).json({ error: "Order cannot be cancelled" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: "CANCELLED" })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  const response = await buildOrderResponse(updated);
  res.json(response);
});

export default router;
