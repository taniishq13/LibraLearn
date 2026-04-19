import { Schema, Document, model, Types } from "mongoose";

export interface ReviewDocument extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const ReviewModel = model<ReviewDocument>("Review", reviewSchema);
