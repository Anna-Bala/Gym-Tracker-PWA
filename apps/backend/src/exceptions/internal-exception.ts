import { ErrorCode, HttpException } from ".";

export class InternalException extends HttpException {
  constructor(message: string, errors: any, errorCode: ErrorCode) {
    super(message, errorCode, 500, errors);
  }
}
