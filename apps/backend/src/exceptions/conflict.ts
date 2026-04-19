import { ErrorCode, HttpException } from ".";

export class ConflictException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 409, null);
  }
}
