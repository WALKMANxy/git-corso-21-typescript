import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = validationResult(req);
  if (!response.isEmpty()) {
    return res.status(400).json(response.array());
  }
  next();
};
