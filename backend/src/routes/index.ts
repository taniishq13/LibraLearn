import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import borrowRouter from "./borrow.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/borrow", borrowRouter);

export default router;
