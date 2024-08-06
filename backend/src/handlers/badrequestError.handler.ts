import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  // constructor(public message: string) {
  //   super(message);
  //   Object.setPrototypeOf(this, BadRequestError.prototype);
  // }
  constructor(public errors: ValidationError[] | string) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (typeof this.errors === 'string') {
      return [{ message: this.errors }];
    } else {
      return [{ message: this.errors[0].msg }];
  }
  }
}
