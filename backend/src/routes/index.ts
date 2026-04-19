import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import borrowRouter from "./borrow.routes";
import reviewRouter from "./review.routes";
import recommendationRouter from "./recommendation.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/borrow", borrowRouter);
router.use("/reviews", reviewRouter);
router.use("/recommendations", recommendationRouter);

export default router;
