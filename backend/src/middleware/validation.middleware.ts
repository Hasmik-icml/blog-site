import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { BadRequestError } from "../handlers/bad-request.handler";

export function validateRequest(
  req: Request,
  res: Response,
  next: Function
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(errors.array());
  }
  next();
}
