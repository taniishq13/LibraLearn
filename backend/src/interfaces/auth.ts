import { Request } from "express";

export type UserRole = "student" | "librarian";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtUserPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}
