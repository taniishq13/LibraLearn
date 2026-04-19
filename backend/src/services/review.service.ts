import { AppError } from "../utils/AppError";
import { bookRepository } from "../repositories/book.repository";
import { reviewRepository } from "../repositories/review.repository";
import { ReviewDocument } from "../models/Review";

type CreateReviewInput = {
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
};

class ReviewService {
  async addReview(input: CreateReviewInput): Promise<ReviewDocument> {
    const book = await bookRepository.findById(input.bookId);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    if (input.rating < 1 || input.rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const existingReview = await reviewRepository.findByUserAndBook(
      input.userId,
      input.bookId
    );

    if (existingReview) {
      throw new AppError("You already reviewed this book", 400);
    }

    const review = await reviewRepository.createReview(input);

    const reviewCount = book.reviewCount + 1;
    const totalRating = book.averageRating * book.reviewCount + input.rating;
    const averageRating = Number((totalRating / reviewCount).toFixed(1));

    await bookRepository.updateRatings(book._id.toString(), averageRating, reviewCount);

    return review;
  }

  async getReviewsByBook(bookId: string): Promise<ReviewDocument[]> {
    const book = await bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return reviewRepository.findByBookId(bookId);
  }
}

export const reviewService = new ReviewService();
