import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { authenticate, allowRoles } from "../middlewares/auth.middleware";

const bookRouter = Router();

bookRouter.get("/search", bookController.searchBooks);
bookRouter.get("/", bookController.getBooks);
bookRouter.get("/:id", bookController.getBookById);
bookRouter.post("/", authenticate, allowRoles("librarian"), bookController.createBook);
bookRouter.put("/:id", authenticate, allowRoles("librarian"), bookController.updateBook);
bookRouter.delete("/:id", authenticate, allowRoles("librarian"), bookController.deleteBook);

export default bookRouter;
