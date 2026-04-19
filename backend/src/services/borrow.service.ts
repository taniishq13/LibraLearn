import { AppError } from "../utils/AppError";
import { bookRepository } from "../repositories/book.repository";
import { borrowRepository } from "../repositories/borrow.repository";
import { BorrowRecordDocument } from "../models/BorrowRecord";

const BORROW_DAYS = 14;
const FINE_PER_DAY = 10;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

class BorrowService {
  async borrowBook(userId: string, bookId: string): Promise<BorrowRecordDocument> {
    const book = await bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    if (book.availableCopies <= 0) {
      throw new AppError("Book is not available right now", 400);
    }

    const existingBorrow = await borrowRepository.findActiveBorrow(userId, bookId);

    if (existingBorrow) {
      throw new AppError("You already borrowed this book", 400);
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

    const borrowRecord = await borrowRepository.createBorrowRecord({
      userId,
      bookId,
      borrowDate,
      dueDate,
      status: "borrowed",
      fineAmount: 0
    });

    await bookRepository.updateBook(bookId, {
      availableCopies: book.availableCopies - 1
    });

    return borrowRecord;
  }

  async returnBook(recordId: string, userId: string): Promise<BorrowRecordDocument> {
    const borrowRecord = await borrowRepository.findById(recordId);

    if (!borrowRecord) {
      throw new AppError("Borrow record not found", 404);
    }

    if (borrowRecord.userId.toString() !== userId) {
      throw new AppError("You cannot return this book", 403);
    }

    if (borrowRecord.status === "returned") {
      throw new AppError("Book already returned", 400);
    }

    const book = await bookRepository.findById(borrowRecord.bookId.toString());

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    const returnDate = new Date();
    const fineAmount = this.calculateFine(borrowRecord.dueDate, returnDate);

    const updatedRecord = await borrowRepository.updateRecord(recordId, {
      returnDate,
      status: "returned",
      fineAmount
    });

    await bookRepository.updateBook(book._id.toString(), {
      availableCopies: book.availableCopies + 1
    });

    if (!updatedRecord) {
      throw new AppError("Could not update borrow record", 500);
    }

    return updatedRecord;
  }

  async getHistory(userId: string): Promise<BorrowRecordDocument[]> {
    return borrowRepository.findByUserId(userId);
  }

  async getAllRecords(): Promise<BorrowRecordDocument[]> {
    return borrowRepository.findAll();
  }

  private calculateFine(dueDate: Date, returnDate: Date): number {
    const diff = returnDate.getTime() - dueDate.getTime();

    if (diff <= 0) {
      return 0;
    }

    const lateDays = Math.ceil(diff / MS_PER_DAY);
    return lateDays * FINE_PER_DAY;
  }
}

export const borrowService = new BorrowService();
