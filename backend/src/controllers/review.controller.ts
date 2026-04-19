import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth";
import { AppError } from "../utils/AppError";
import { reviewService } from "../services/review.service";
import { isValidObjectId } from "../utils/isValidObjectId";

class ReviewController {
  addReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { bookId, rating, comment } = req.body;

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (!isValidObjectId(String(bookId))) {
        throw new AppError("Invalid book id", 400);
      }

      const review = await reviewService.addReview({
        userId: authReq.user.userId,
        bookId: String(bookId),
        rating: Number(rating),
        comment: String(comment).trim()
      });

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const bookId = String(req.params.bookId).trim();

      if (!isValidObjectId(bookId)) {
        throw new AppError("Invalid book id", 400);
      }

      const reviews = await reviewService.getReviewsByBook(bookId);

      return res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  };
}

export const reviewController = new ReviewController();
