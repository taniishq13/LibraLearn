import { BookDocument } from "../models/Book";
import {
  RecommendationType
} from "../strategies/recommendation.strategy";
import { recommendationFactory } from "../strategies/recommendation.factory";

class RecommendationService {
  async getRecommendations(
    userId: string,
    type: RecommendationType = "history"
  ): Promise<BookDocument[]> {
    const strategy = recommendationFactory.getStrategy(type);
    return strategy.getRecommendations(userId);
  }
}

export const recommendationService = new RecommendationService();
