import {
  RecommendationStrategy,
  RecommendationType
} from "./recommendation.strategy";
import { borrowHistoryBasedStrategy } from "./BorrowHistoryBasedStrategy";
import { popularityStrategy } from "./PopularityStrategy";

class RecommendationFactory {
  getStrategy(type: RecommendationType): RecommendationStrategy {
    if (type === "popular") {
      return popularityStrategy;
    }

    return borrowHistoryBasedStrategy;
  }
}

export const recommendationFactory = new RecommendationFactory();
