import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth";
import { AppError } from "../utils/AppError";
import { recommendationService } from "../services/recommendation.service";
import { RecommendationType } from "../strategies/recommendation.strategy";

class RecommendationController {
  getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const type = String(req.query.type ?? "history") as RecommendationType;

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const recommendations = await recommendationService.getRecommendations(
        authReq.user.userId,
        type
      );

      return res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      next(error);
    }
  };
}

export const recommendationController = new RecommendationController();
