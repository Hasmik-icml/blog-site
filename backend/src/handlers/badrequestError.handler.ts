import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[] | string) {
    super(typeof errors === 'string' ? errors : 'Invalid request parameters');
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (typeof this.errors === 'string') {
      return [{ message: this.errors }];
    } else {
      return this.errors.map(err => {
        return { message: err.msg, field: err.type === 'field' ? err.path : undefined };
      });
    }
  }
}
