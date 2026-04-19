import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate, allowRoles } from "../middlewares/auth.middleware";

const reviewRouter = Router();

reviewRouter.post("/", authenticate, allowRoles("student"), reviewController.addReview);
reviewRouter.get("/book/:bookId", reviewController.getReviewsByBook);

export default reviewRouter;
