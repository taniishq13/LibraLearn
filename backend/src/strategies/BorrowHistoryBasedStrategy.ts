import { RecommendationStrategy } from "./recommendation.strategy";
import { BookDocument } from "../models/Book";
import { borrowRepository } from "../repositories/borrow.repository";
import { bookRepository } from "../repositories/book.repository";

class BorrowHistoryBasedStrategy implements RecommendationStrategy {
  async getRecommendations(userId: string): Promise<BookDocument[]> {
    const records = await borrowRepository.findByUserId(userId);

    if (records.length === 0) {
      return this.getFallbackRecommendations();
    }

    const borrowedBookIds = records.map((record) => record.bookId.toString());
    const borrowedBooks = await bookRepository.findByIds(borrowedBookIds);

    const categories = [...new Set(borrowedBooks.map((book) => book.category))];

    if (categories.length === 0) {
      return this.getFallbackRecommendations();
    }

    return bookRepository.findByCategories(categories, borrowedBookIds);
  }

  private async getFallbackRecommendations(): Promise<BookDocument[]> {
    const popularIds = await borrowRepository.getPopularBookIds(5);
    if (popularIds.length === 0) {
      return [];
    }

    const books = await bookRepository.findByIds(popularIds);
    return this.sortByIdOrder(books, popularIds);
  }

  private sortByIdOrder(books: BookDocument[], ids: string[]): BookDocument[] {
    const order = new Map(ids.map((id, index) => [id, index]));
    return books.sort(
      (left, right) =>
        (order.get(left._id.toString()) ?? 0) - (order.get(right._id.toString()) ?? 0)
    );
  }
}

export const borrowHistoryBasedStrategy = new BorrowHistoryBasedStrategy();
