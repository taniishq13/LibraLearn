import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth";
import { borrowService } from "../services/borrow.service";
import { AppError } from "../utils/AppError";
import { isValidObjectId } from "../utils/isValidObjectId";

class BorrowController {
  borrowBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const bookId = String(req.body.bookId ?? "").trim();

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (!isValidObjectId(bookId)) {
        throw new AppError("Invalid book id", 400);
      }

      const record = await borrowService.borrowBook(authReq.user.userId, bookId);

      return res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: record
      });
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const recordId = String(req.params.recordId).trim();

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      if (!isValidObjectId(recordId)) {
        throw new AppError("Invalid borrow record id", 400);
      }

      const record = await borrowService.returnBook(recordId, authReq.user.userId);

      return res.status(200).json({
        success: true,
        message: "Book returned successfully",
        data: record
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const history = await borrowService.getHistory(authReq.user.userId);

      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  };

  getAllRecords = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const records = await borrowService.getAllRecords();

      return res.status(200).json({
        success: true,
        data: records
      });
    } catch (error) {
      next(error);
    }
  };
}

export const borrowController = new BorrowController();
