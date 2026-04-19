import { Router } from "express";
import { borrowController } from "../controllers/borrow.controller";
import { authenticate, allowRoles } from "../middlewares/auth.middleware";

const borrowRouter = Router();

borrowRouter.post("/", authenticate, allowRoles("student"), borrowController.borrowBook);
borrowRouter.post(
  "/:recordId/return",
  authenticate,
  allowRoles("student"),
  borrowController.returnBook
);
borrowRouter.get("/history", authenticate, allowRoles("student"), borrowController.getHistory);
borrowRouter.get(
  "/records",
  authenticate,
  allowRoles("librarian"),
  borrowController.getAllRecords
);

export default borrowRouter;
