import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom.error";
import { BadRequestError } from "./bad-request.handler";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public errors: ValidationError[] | string) {
    super(typeof errors === 'string' ? errors : 'Invalid request parameters');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    if (typeof this.errors === 'string') {
      return [{ message: this.errors }];
    } else {
      return [{
        message: this.errors[0].msg,
      }];
    }
  }
}
