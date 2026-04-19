import { NextFunction, Request, Response } from "express";
import { bookService } from "../services/book.service";
import { AppError } from "../utils/AppError";
import { isValidObjectId } from "../utils/isValidObjectId";

class BookController {
  createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const book = await bookService.createBook(req.body);

      return res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: book
      });
    } catch (error) {
      next(error);
    }
  };

  getBooks = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const books = await bookService.getBooks();

      return res.status(200).json({
        success: true,
        data: books
      });
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = String(req.params.id).trim();

      if (!isValidObjectId(id)) {
        throw new AppError("Invalid book id", 400);
      }

      const book = await bookService.getBookById(id);

      return res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      next(error);
    }
  };

  searchBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const query = String(req.query.q ?? "").trim();

      const books = query ? await bookService.searchBooks(query) : [];

      return res.status(200).json({
        success: true,
        data: books
      });
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = String(req.params.id).trim();

      if (!isValidObjectId(id)) {
        throw new AppError("Invalid book id", 400);
      }

      const book = await bookService.updateBook(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = String(req.params.id).trim();

      if (!isValidObjectId(id)) {
        throw new AppError("Invalid book id", 400);
      }

      await bookService.deleteBook(id);

      return res.status(200).json({
        success: true,
        message: "Book deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}

export const bookController = new BookController();
