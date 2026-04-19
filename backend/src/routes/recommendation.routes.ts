import { Router } from "express";
import { recommendationController } from "../controllers/recommendation.controller";
import { authenticate, allowRoles } from "../middlewares/auth.middleware";

const recommendationRouter = Router();

recommendationRouter.get(
  "/",
  authenticate,
  allowRoles("student"),
  recommendationController.getRecommendations
);

export default recommendationRouter;
