import { AuthUser, Book, BorrowRecord, Review, UserRole } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

const getToken = () => localStorage.getItem("libralearn_token");

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const delays = [2000, 4000, 8000, 16000];
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
          ...(options.headers ?? {})
        }
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        if (
          attempt < delays.length &&
          [502, 503, 504].includes(response.status)
        ) {
          await sleep(delays[attempt]);
          continue;
        }

        throw new Error(data.message ?? "Something went wrong");
      }

      return data;
    } catch (error) {
      lastError = error;

      if (attempt < delays.length) {
        await sleep(delays[attempt]);
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to reach the server");
}

export const api = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<{ user: AuthUser; token: string }> {
    const result = await request<{ user: AuthUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return result.data!;
  },

  async login(payload: { email: string; password: string }): Promise<{ user: AuthUser; token: string }> {
    const result = await request<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return result.data!;
  },

  async getMe(): Promise<AuthUser> {
    const result = await request<AuthUser>("/auth/me");
    return result.data!;
  },

  async getBooks(query = ""): Promise<Book[]> {
    const endpoint = query.trim() ? `/books/search?q=${encodeURIComponent(query)}` : "/books";
    const result = await request<Book[]>(endpoint);
    return result.data ?? [];
  },

  async createBook(payload: {
    title: string;
    author: string;
    category: string;
    isbn: string;
    totalCopies: number;
  }): Promise<Book> {
    const result = await request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return result.data!;
  },

  async borrowBook(bookId: string): Promise<BorrowRecord> {
    const result = await request<BorrowRecord>("/borrow", {
      method: "POST",
      body: JSON.stringify({ bookId })
    });

    return result.data!;
  },

  async returnBook(recordId: string): Promise<BorrowRecord> {
    const result = await request<BorrowRecord>(`/borrow/${recordId}/return`, {
      method: "POST"
    });

    return result.data!;
  },

  async getHistory(): Promise<BorrowRecord[]> {
    const result = await request<BorrowRecord[]>("/borrow/history");
    return result.data ?? [];
  },

  async addReview(payload: {
    bookId: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const result = await request<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return result.data!;
  },

  async getRecommendations(type: "history" | "popular" = "history"): Promise<Book[]> {
    const result = await request<Book[]>(`/recommendations?type=${type}`);
    return result.data ?? [];
  }
};
