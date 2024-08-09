import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom.error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public errors: ValidationError[] | string) {
    super(typeof errors === 'string' ? errors : 'Invalid request parameters');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
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
