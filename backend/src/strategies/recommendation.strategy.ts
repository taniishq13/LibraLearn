import { BookDocument } from "../models/Book";

export type RecommendationType = "history" | "popular";

export interface RecommendationStrategy {
  getRecommendations(userId: string): Promise<BookDocument[]>;
}
