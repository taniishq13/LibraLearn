import mongoose from "mongoose";

export const isValidObjectId = (value: string): boolean => {
  return mongoose.Types.ObjectId.isValid(value);
};
