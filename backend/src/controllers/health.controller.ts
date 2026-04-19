import { Request, Response } from "express";

class HealthController {
  check = (_req: Request, res: Response): Response => {
    return res.status(200).json({
      success: true,
      message: "LibraLearn backend is running"
    });
  };
}

export const healthController = new HealthController();
