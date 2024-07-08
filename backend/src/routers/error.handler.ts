import { validationResult } from "express-validator";
import { Request, Response } from "express";

export function validateRequest(req: Request, res: Response, next: Function): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new Error("Bad request");
    }
    next();
}