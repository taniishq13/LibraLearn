import { AppError } from "../utils/AppError";
import { bookRepository } from "../repositories/book.repository";

type CreateBookInput = {
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies?: number;
};

type UpdateBookInput = Partial<CreateBookInput>;

class BookService {
  async createBook(input: CreateBookInput) {
    const existingBook = await bookRepository.findByIsbn(input.isbn);

    if (existingBook) {
      throw new AppError("Book with this ISBN already exists", 400);
    }

    const availableCopies = input.availableCopies ?? input.totalCopies;

    if (availableCopies > input.totalCopies) {
      throw new AppError("Available copies cannot be more than total copies", 400);
    }

    return bookRepository.createBook({
      title: input.title,
      author: input.author,
      category: input.category,
      isbn: input.isbn,
      totalCopies: input.totalCopies,
      availableCopies
    });
  }

  async getBooks() {
    return bookRepository.getBooks();
  }

  async getBookById(id: string) {
    const book = await bookRepository.findById(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  }

  async searchBooks(query: string) {
    return bookRepository.searchBooks(query);
  }

  async updateBook(id: string, input: UpdateBookInput) {
    const book = await bookRepository.findById(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    if (input.isbn && input.isbn !== book.isbn) {
      const duplicateBook = await bookRepository.findByIsbn(input.isbn);

      if (duplicateBook) {
        throw new AppError("Book with this ISBN already exists", 400);
      }
    }

    const totalCopies = input.totalCopies ?? book.totalCopies;
    const availableCopies = input.availableCopies ?? book.availableCopies;

    if (availableCopies > totalCopies) {
      throw new AppError("Available copies cannot be more than total copies", 400);
    }

    return bookRepository.updateBook(id, {
      ...input,
      totalCopies,
      availableCopies
    });
  }

  async deleteBook(id: string) {
    const book = await bookRepository.findById(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return bookRepository.deleteBook(id);
  }
}

export const bookService = new BookService();
