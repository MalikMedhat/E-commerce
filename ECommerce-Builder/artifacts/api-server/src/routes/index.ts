import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import categoriesRouter from "./categories.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import storeRouter from "./store.js";
import paymentsRouter from "./payments.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Public routes (no auth required)
router.use(healthRouter);
router.use(authRouter);

// Protected routes (auth required)
router.use(requireAuth);

router.use(categoriesRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(storeRouter);
router.use(paymentsRouter);

export default router;
