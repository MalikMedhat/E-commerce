import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartsTable, cartItemsTable, productsTable } from "@workspace/db";
import {
  AddCartItemBody,
  UpdateCartItemBody,
  UpdateCartItemParams,
  RemoveCartItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateCart(userId: number) {
  let [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, userId));
  if (!cart) {
    [cart] = await db.insert(cartsTable).values({ userId }).returning();
  }
  return cart;
}

async function buildCartResponse(cartId: number, userId: number) {
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      productName: productsTable.name,
      price: productsTable.price,
      quantity: cartItemsTable.quantity,
      imageUrl: productsTable.imageUrl,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.cartId, cartId));

  const total = items.reduce((sum, item) => sum + parseFloat(String(item.price)) * item.quantity, 0);

  return {
    id: cartId,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      price: parseFloat(String(item.price)),
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    })),
    total,
  };
}

router.get("/cart", async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as number;
  const cart = await getOrCreateCart(userId);
  const response = await buildCartResponse(cart.id, userId);
  res.json(response);
});

router.delete("/cart", async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as number;
  const cart = await getOrCreateCart(userId);
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  res.json({ id: cart.id, items: [], total: 0 });
});

router.post("/cart/items", async (req: Request, res: Response): Promise<void> => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req as any).userId as number;
  const { productId, quantity } = parsed.data;

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const cart = await getOrCreateCart(userId);

  // Check if item already exists
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.cartId, cart.id), eq(cartItemsTable.productId, productId)));

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: Math.min(10, existing.quantity + quantity) })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ cartId: cart.id, productId, quantity });
  }

  const response = await buildCartResponse(cart.id, userId);
  res.json(response);
});

router.put("/cart/items/:id", async (req: Request, res: Response): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req as any).userId as number;
  const cart = await getOrCreateCart(userId);

  const [item] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.id, params.data.id), eq(cartItemsTable.cartId, cart.id)));

  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  await db.update(cartItemsTable).set({ quantity: parsed.data.quantity }).where(eq(cartItemsTable.id, params.data.id));

  const response = await buildCartResponse(cart.id, userId);
  res.json(response);
});

router.delete("/cart/items/:id", async (req: Request, res: Response): Promise<void> => {
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as any).userId as number;
  const cart = await getOrCreateCart(userId);

  const [item] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.id, params.data.id), eq(cartItemsTable.cartId, cart.id)));

  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.id));

  const response = await buildCartResponse(cart.id, userId);
  res.json(response);
});

export default router;
