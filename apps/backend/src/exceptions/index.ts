export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  error: any;

  constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum ErrorCode {
  UNPROCESSABLE_ENTITY = 1001,
  INTERNAL_EXCEPTION = 1005,
  USER_ALREADY_EXISTS = 2001,
  USER_NOT_FOUND = 2002,
  INCORRECT_PASSWORD = 2003,
}
