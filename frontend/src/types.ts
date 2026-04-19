export type UserRole = "student" | "librarian";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  averageRating: number;
  reviewCount: number;
};

export type BorrowRecord = {
  _id: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: "borrowed" | "returned";
  fineAmount: number;
};

export type Review = {
  _id: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
};
