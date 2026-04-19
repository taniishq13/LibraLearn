import { Schema, Document, model, Types } from "mongoose";

export type BorrowStatus = "borrowed" | "returned";

export interface BorrowRecordDocument extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  status: BorrowStatus;
  fineAmount: number;
}

const borrowRecordSchema = new Schema<BorrowRecordDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed"
    },
    fineAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const BorrowRecordModel = model<BorrowRecordDocument>(
  "BorrowRecord",
  borrowRecordSchema
);
