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
      // return this.errors.map(err => {
      return [{
        message: this.errors[0].msg,
        //  field: this.errors[0].type === 'field' ? this.errors[0].path : undefined 
      }];
      // });
    }
  }
}
