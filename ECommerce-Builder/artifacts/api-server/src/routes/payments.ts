import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import { CreatePaymentIntentBody, ConfirmPaymentBody } from "@workspace/api-zod";

const router: IRouter = Router();

// Create a Stripe payment intent for an order
router.post("/payments/create-intent", async (req: Request, res: Response): Promise<void> => {
  const parsed = CreatePaymentIntentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { orderId } = parsed.data;

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) {
    res.status(400).json({ error: "Invalid order" });
    return;
  }

  // In a full implementation, this would create a Stripe PaymentIntent
  // For now, we return a mock response
  const amount = parseFloat(String(order.total));

  res.json({
    clientSecret: `pi_mock_${orderId}_${Date.now()}_secret`,
    amount,
    currency: "usd",
  });
});

// Confirm payment and update order status
router.post("/payments/confirm", async (req: Request, res: Response): Promise<void> => {
  const parsed = ConfirmPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { orderId, paymentIntentId } = parsed.data;

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) {
    res.status(400).json({ error: "Invalid order" });
    return;
  }

  // Update order status to PAID
  const [updated] = await db
    .update(ordersTable)
    .set({ status: "PAID", paymentIntentId })
    .where(eq(ordersTable.id, orderId))
    .returning();

  // Build response with items
  const { orderItemsTable } = await import("@workspace/db");
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));

  res.json({
    id: updated.id,
    userId: updated.userId,
    status: updated.status,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      priceAtPurchase: parseFloat(String(item.priceAtPurchase)),
      quantity: item.quantity,
      imageUrl: item.productImageUrl,
    })),
    total: parseFloat(String(updated.total)),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
});

export default router;
