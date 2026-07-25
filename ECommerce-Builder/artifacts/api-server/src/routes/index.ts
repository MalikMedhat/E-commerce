import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import storeRouter from "./store";
import paymentsRouter from "./payments";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

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
