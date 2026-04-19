import { RecommendationStrategy } from "./recommendation.strategy";
import { BookDocument } from "../models/Book";
import { borrowRepository } from "../repositories/borrow.repository";
import { bookRepository } from "../repositories/book.repository";

class PopularityStrategy implements RecommendationStrategy {
  async getRecommendations(_userId: string): Promise<BookDocument[]> {
    const popularIds = await borrowRepository.getPopularBookIds(5);

    if (popularIds.length === 0) {
      return [];
    }

    const books = await bookRepository.findByIds(popularIds);
    const order = new Map(popularIds.map((id, index) => [id, index]));

    return books.sort(
      (left, right) =>
        (order.get(left._id.toString()) ?? 0) - (order.get(right._id.toString()) ?? 0)
    );
  }
}

export const popularityStrategy = new PopularityStrategy();
