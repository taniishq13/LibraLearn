import { BookDocument, BookModel } from "../models/Book";

type CreateBookInput = {
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
};

type UpdateBookInput = Partial<CreateBookInput>;

class BookRepository {
  createBook(data: CreateBookInput): Promise<BookDocument> {
    return BookModel.create(data);
  }

  getBooks(): Promise<BookDocument[]> {
    return BookModel.find().sort({ createdAt: -1 });
  }

  findById(id: string): Promise<BookDocument | null> {
    return BookModel.findById(id);
  }

  findByIsbn(isbn: string): Promise<BookDocument | null> {
    return BookModel.findOne({ isbn });
  }

  searchBooks(query: string): Promise<BookDocument[]> {
    const search = new RegExp(query, "i");

    return BookModel.find({
      $or: [
        { title: search },
        { author: search },
        { category: search },
        { isbn: search }
      ]
    }).sort({ createdAt: -1 });
  }

  updateBook(id: string, data: UpdateBookInput): Promise<BookDocument | null> {
    return BookModel.findByIdAndUpdate(id, data, { new: true });
  }

  updateRatings(
    id: string,
    averageRating: number,
    reviewCount: number
  ): Promise<BookDocument | null> {
    return BookModel.findByIdAndUpdate(
      id,
      { averageRating, reviewCount },
      { new: true }
    );
  }

  deleteBook(id: string): Promise<BookDocument | null> {
    return BookModel.findByIdAndDelete(id);
  }
}

export const bookRepository = new BookRepository();
