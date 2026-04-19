import { ReviewDocument, ReviewModel } from "../models/Review";

type CreateReviewInput = {
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
};

class ReviewRepository {
  createReview(data: CreateReviewInput): Promise<ReviewDocument> {
    return ReviewModel.create(data);
  }

  findByUserAndBook(userId: string, bookId: string): Promise<ReviewDocument | null> {
    return ReviewModel.findOne({ userId, bookId });
  }

  findByBookId(bookId: string): Promise<ReviewDocument[]> {
    return ReviewModel.find({ bookId }).sort({ createdAt: -1 });
  }
}

export const reviewRepository = new ReviewRepository();
