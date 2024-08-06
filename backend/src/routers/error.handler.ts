import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { BadRequestError } from "../handlers/badrequestError.handler";

export function validateRequest(
  req: Request,
  res: Response,
  next: Function
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new BadRequestError(errors.array());
  }
  next();
}
