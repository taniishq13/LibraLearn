import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { AuthUser, Book, BorrowRecord, UserRole } from "./types";

type AuthMode = "login" | "register";
type RecommendationType = "history" | "popular";

const emptyBookForm = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  totalCopies: 1
};

export default function App() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [message, setMessage] = useState("Start by logging in or registering.");
  const [error, setError] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [recommendationType, setRecommendationType] =
    useState<RecommendationType>("history");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole
  });
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("libralearn_token");

    if (!token) {
      setTokenReady(true);
      loadBooks();
      return;
    }

    api
      .getMe()
      .then((me) => {
        setUser(me);
        setMessage(`Welcome back, ${me.name}.`);
      })
      .catch(() => {
        localStorage.removeItem("libralearn_token");
      })
      .finally(() => {
        setTokenReady(true);
        loadBooks();
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setRecommendations([]);
      return;
    }

    loadHistory();
    loadRecommendations(recommendationType);
  }, [user, recommendationType]);

  const loadBooks = async (query = "") => {
    try {
      setError("");
      const data = await api.getBooks(query);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load books");
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch {
      setHistory([]);
    }
  };

  const loadRecommendations = async (type: RecommendationType) => {
    try {
      const data = await api.getRecommendations(type);
      setRecommendations(data);
    } catch {
      setRecommendations([]);
    }
  };

  const handleAuthSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      const result =
        mode === "register"
          ? await api.register({
              name: authForm.name,
              email: authForm.email,
              password: authForm.password,
              role: authForm.role
            })
          : await api.login({
              email: authForm.email,
              password: authForm.password
            });

      localStorage.setItem("libralearn_token", result.token);
      setUser(result.user);
      setMessage(`${mode === "register" ? "Registered" : "Logged in"} successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    await loadBooks(search);
  };

  const handleAddBook = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const created = await api.createBook({
        ...bookForm,
        totalCopies: Number(bookForm.totalCopies)
      });

      setBooks((current) => [created, ...current]);
      setBookForm(emptyBookForm);
      setMessage("Book added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add book");
    }
  };

  const handleBorrow = async (bookId: string) => {
    try {
      await api.borrowBook(bookId);
      setMessage("Book borrowed.");
      await loadBooks(search);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not borrow book");
    }
  };

  const handleReturn = async (recordId: string) => {
    try {
      await api.returnBook(recordId);
      setMessage("Book returned.");
      await loadBooks(search);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not return book");
    }
  };

  const handleReview = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await api.addReview({
        bookId: selectedBookId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      setMessage("Review submitted.");
      setReviewForm({ rating: 5, comment: "" });
      await loadBooks(search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review");
    }
  };

  const handleRecommendations = async () => {
    await loadRecommendations(recommendationType);
    setMessage(`Loaded ${recommendationType} recommendations.`);
  };

  const handleLogout = () => {
    localStorage.removeItem("libralearn_token");
    setUser(null);
    setHistory([]);
    setRecommendations([]);
    setMessage("Logged out.");
  };

  if (!tokenReady) {
    return <div className="app-shell">Loading LibraLearn...</div>;
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">LibraLearn</p>
          <h1>Smart Library Management for College Projects</h1>
          <p className="subtitle">
            Simple full-stack demo with auth, books, borrowing, reviews, and recommendations.
          </p>
        </div>
        <div className="status-card">
          <span>{user ? `${user.name} · ${user.role}` : "Guest mode"}</span>
          <strong>{message}</strong>
          {error ? <p className="error-text">{error}</p> : null}
          {user ? (
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <div className="section-head">
            <h2>Authentication</h2>
            <div className="segmented">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="form-grid">
            {mode === "register" ? (
              <input
                placeholder="Full name"
                value={authForm.name}
                onChange={(event) =>
                  setAuthForm({ ...authForm, name: event.target.value })
                }
              />
            ) : null}
            <input
              placeholder="Email"
              type="email"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm({ ...authForm, email: event.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
            />
            {mode === "register" ? (
              <select
                value={authForm.role}
                onChange={(event) =>
                  setAuthForm({
                    ...authForm,
                    role: event.target.value as UserRole
                  })
                }
              >
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
              </select>
            ) : null}
            <button type="submit">{mode === "login" ? "Login" : "Create account"}</button>
          </form>
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Browse Books</h2>
            <form onSubmit={handleSearch} className="inline-form">
              <input
                placeholder="Search title, author, or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="list">
            {books.map((book) => (
              <article key={book._id} className="list-item">
                <div>
                  <h3>{book.title}</h3>
                  <p>
                    {book.author} · {book.category}
                  </p>
                  <p className="meta">
                    ISBN {book.isbn} · {book.availableCopies}/{book.totalCopies} copies ·
                    Rating {book.averageRating.toFixed(1)} ({book.reviewCount})
                  </p>
                </div>
                <div className="actions">
                  <button onClick={() => handleBorrow(book._id)} disabled={!user || user.role !== "student"}>
                    Borrow
                  </button>
                  <button
                    className="secondary"
                    onClick={() => setSelectedBookId(book._id)}
                  >
                    Review
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Librarian Add Book</h2>
          <form onSubmit={handleAddBook} className="form-grid">
            <input
              placeholder="Title"
              value={bookForm.title}
              onChange={(event) =>
                setBookForm({ ...bookForm, title: event.target.value })
              }
              disabled={!user || user.role !== "librarian"}
            />
            <input
              placeholder="Author"
              value={bookForm.author}
              onChange={(event) =>
                setBookForm({ ...bookForm, author: event.target.value })
              }
              disabled={!user || user.role !== "librarian"}
            />
            <input
              placeholder="Category"
              value={bookForm.category}
              onChange={(event) =>
                setBookForm({ ...bookForm, category: event.target.value })
              }
              disabled={!user || user.role !== "librarian"}
            />
            <input
              placeholder="ISBN"
              value={bookForm.isbn}
              onChange={(event) =>
                setBookForm({ ...bookForm, isbn: event.target.value })
              }
              disabled={!user || user.role !== "librarian"}
            />
            <input
              placeholder="Total copies"
              type="number"
              min="1"
              value={bookForm.totalCopies}
              onChange={(event) =>
                setBookForm({
                  ...bookForm,
                  totalCopies: Number(event.target.value)
                })
              }
              disabled={!user || user.role !== "librarian"}
            />
            <button type="submit" disabled={!user || user.role !== "librarian"}>
              Add book
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Return Borrowed Book</h2>
          <div className="list">
            {history.map((record) => (
              <article key={record._id} className="list-item compact">
                <div>
                  <p>
                    Record {record._id.slice(0, 8)} · Status {record.status}
                  </p>
                  <p className="meta">
                    Due {new Date(record.dueDate).toLocaleDateString()} · Fine ₹{record.fineAmount}
                  </p>
                </div>
                <button
                  className="secondary"
                  onClick={() => handleReturn(record._id)}
                  disabled={record.status === "returned" || !user || user.role !== "student"}
                >
                  Return
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Submit Review</h2>
          <form onSubmit={handleReview} className="form-grid">
            <select
              value={selectedBookId}
              onChange={(event) => setSelectedBookId(event.target.value)}
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
            <select
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  rating: Number(event.target.value)
                })
              }
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
            <textarea
              rows={4}
              placeholder="Write a short review"
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, comment: event.target.value })
              }
            />
            <button
              type="submit"
              disabled={!user || user.role !== "student" || !selectedBookId}
            >
              Add review
            </button>
          </form>
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Recommendations</h2>
            <div className="segmented">
              <button
                className={recommendationType === "history" ? "active" : ""}
                onClick={() => setRecommendationType("history")}
              >
                History
              </button>
              <button
                className={recommendationType === "popular" ? "active" : ""}
                onClick={() => setRecommendationType("popular")}
              >
                Popular
              </button>
            </div>
          </div>

          <button onClick={handleRecommendations} disabled={!user || user.role !== "student"}>
            Load recommendations
          </button>

          <div className="list">
            {recommendations.map((book) => (
              <article key={book._id} className="list-item compact">
                <div>
                  <h3>{book.title}</h3>
                  <p className="meta">
                    {book.author} · Rating {book.averageRating.toFixed(1)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
