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
  MISSING_TOKEN = 2004,
  INVALID_TOKEN = 2005,
  MISSING_USER_ID = 2006,
  MISSING_PASSWORD = 2007,
  USER_ONBOARDING_ALREADY_EXISTS = 3001,
  USER_ONBOARDING_MISSING = 3002,
  MISSING_ID = 4001,
}
