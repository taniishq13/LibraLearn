import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { AuthenticatedRequest } from "../interfaces/auth";
import { AppError } from "../utils/AppError";

class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register({ name, email, password, role });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.user?.userId) {
        throw new AppError("Unauthorized", 401);
      }

      const user = await authService.getProfile(authReq.user.userId);

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
