import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "../utils/AppError";
import {
  AuthenticatedRequest,
  JwtUserPayload,
  UserRole
} from "../interfaces/auth";

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, config.jwtSecret) as JwtUserPayload;

  req.user = decoded;
  next();
};

export const allowRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
};
