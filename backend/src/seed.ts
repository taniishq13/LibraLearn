import "dotenv/config";
import bcrypt from "bcryptjs";
import { mongoConnection } from "./config/mongoConnection";
import { UserModel } from "./models/User";
import { BookModel } from "./models/Book";
import { BorrowRecordModel } from "./models/BorrowRecord";
import { ReviewModel } from "./models/Review";

const seed = async (): Promise<void> => {
  await mongoConnection.connect();

  await Promise.all([
    UserModel.deleteMany({}),
    BookModel.deleteMany({}),
    BorrowRecordModel.deleteMany({}),
    ReviewModel.deleteMany({})
  ]);

  const password = await bcrypt.hash("Password123", 10);

  const librarian = await UserModel.create({
    name: "Libra Librarian",
    email: "librarian@libralearn.com",
    password,
    role: "librarian"
  });

  const student = await UserModel.create({
    name: "Rahul Sharma",
    email: "rahul@libralearn.com",
    password,
    role: "student"
  });

  const books = await BookModel.insertMany([
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      isbn: "9780132350884",
      totalCopies: 4,
      availableCopies: 3,
      averageRating: 4.5,
      reviewCount: 2
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      category: "Programming",
      isbn: "9780201616224",
      totalCopies: 5,
      availableCopies: 4,
      averageRating: 4.6,
      reviewCount: 3
    },
    {
      title: "Design of Everyday Things",
      author: "Don Norman",
      category: "Design",
      isbn: "9780465050659",
      totalCopies: 3,
      availableCopies: 2,
      averageRating: 4.5,
      reviewCount: 1
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self Help",
      isbn: "9780735211292",
      totalCopies: 6,
      availableCopies: 5,
      averageRating: 4.7,
      reviewCount: 4
    },
    {
      title: "You Don't Know JS Yet",
      author: "Kyle Simpson",
      category: "Programming",
      isbn: "9781091210098",
      totalCopies: 2,
      availableCopies: 2,
      averageRating: 4.4,
      reviewCount: 1
    }
  ]);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await BorrowRecordModel.create([
    {
      userId: student._id,
      bookId: books[0]._id,
      borrowDate: new Date(),
      dueDate,
      status: "borrowed",
      fineAmount: 0
    },
    {
      userId: student._id,
      bookId: books[2]._id,
      borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: "returned",
      fineAmount: 40
    }
  ]);

  await ReviewModel.create([
    {
      userId: student._id,
      bookId: books[0]._id,
      rating: 5,
      comment: "Very useful for coding practice."
    },
    {
      userId: librarian._id,
      bookId: books[0]._id,
      rating: 4,
      comment: "A classic for every student shelf."
    },
    {
      userId: student._id,
      bookId: books[2]._id,
      rating: 4,
      comment: "Nice book for design basics."
    }
  ]);

  console.log("Demo data seeded successfully");
  console.log("Login credentials:");
  console.log("Librarian -> librarian@libralearn.com / Password123");
  console.log("Student    -> rahul@libralearn.com / Password123");
  console.log("Sample borrowed books and reviews are ready for testing.");

  process.exit(0);
};

void seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
