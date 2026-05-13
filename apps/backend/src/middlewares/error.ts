import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";

export const errorMiddleware = (error: HttpException, _req: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode, errors: error.error });
};
