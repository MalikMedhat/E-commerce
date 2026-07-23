import { Router, type IRouter, type Request, type Response } from "express";
import { db, categoriesTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(ListCategoriesResponse.parse(categories));
});

export default router;
