import { Router, type IRouter, type Request, type Response } from "express";
import { eq, ilike, and, asc, desc, count, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  GetProductParams,
  GetProductResponse,
  GetRelatedProductsParams,
  GetRelatedProductsResponse,
  GetFeaturedProductsResponse,
  ListProductsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function normalizeProduct(row: any) {
  return {
    ...row,
    price: parseFloat(String(row.price)),
  };
}

// Helper to join product with category
async function getProductWithCategory(productId: number) {
  const results = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
      },
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, productId));
  const row = results[0];
  if (!row) return null;
  return normalizeProduct(row);
}

router.get("/products/featured", async (_req: Request, res: Response): Promise<void> => {
  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
      },
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);

  res.json(GetFeaturedProductsResponse.parse(rows.map(normalizeProduct)));
});

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, categoryId, sort, page = 1, limit = 12 } = parsed.data;

  const conditions = [];
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (categoryId) conditions.push(eq(productsTable.categoryId, categoryId));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  if (sort === "price_asc") orderBy = asc(productsTable.price);
  else if (sort === "price_desc") orderBy = desc(productsTable.price);
  else orderBy = desc(productsTable.createdAt);

  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
        },
      })
      .from(productsTable)
      .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(productsTable).where(whereClause),
  ]);

  res.json({
    products: rows.map(normalizeProduct),
    total: totalResult[0].count,
    page,
    limit,
  });
});

router.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const product = await getProductWithCategory(params.data.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(product));
});

router.get("/products/:id/related", async (req: Request, res: Response): Promise<void> => {
  const params = GetRelatedProductsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const product = await getProductWithCategory(params.data.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const related = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
      },
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(and(eq(productsTable.categoryId, product.category.id), sql`${productsTable.id} != ${params.data.id}`))
    .limit(4);

  res.json(GetRelatedProductsResponse.parse(related.map(normalizeProduct)));
});

export default router;
