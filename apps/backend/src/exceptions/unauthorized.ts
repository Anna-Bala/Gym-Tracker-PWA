import { ErrorCode, HttpException } from ".";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errors: any, errorCode: ErrorCode) {
    super(message, errorCode, 401, errors);
  }
}
