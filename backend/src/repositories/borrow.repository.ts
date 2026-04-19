import { BorrowRecordDocument, BorrowRecordModel } from "../models/BorrowRecord";

type CreateBorrowRecordInput = {
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  status: "borrowed";
  fineAmount: number;
};

class BorrowRepository {
  createBorrowRecord(
    data: CreateBorrowRecordInput
  ): Promise<BorrowRecordDocument> {
    return BorrowRecordModel.create(data);
  }

  findById(id: string): Promise<BorrowRecordDocument | null> {
    return BorrowRecordModel.findById(id);
  }

  findActiveBorrow(userId: string, bookId: string): Promise<BorrowRecordDocument | null> {
    return BorrowRecordModel.findOne({
      userId,
      bookId,
      status: "borrowed"
    });
  }

  findByUserId(userId: string): Promise<BorrowRecordDocument[]> {
    return BorrowRecordModel.find({ userId }).sort({ createdAt: -1 });
  }

  findAll(): Promise<BorrowRecordDocument[]> {
    return BorrowRecordModel.find().sort({ createdAt: -1 });
  }

  updateRecord(
    id: string,
    data: Partial<BorrowRecordDocument>
  ): Promise<BorrowRecordDocument | null> {
    return BorrowRecordModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export const borrowRepository = new BorrowRepository();
