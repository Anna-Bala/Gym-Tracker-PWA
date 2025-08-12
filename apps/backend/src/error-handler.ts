import { NextFunction, Request, Response } from "express";
import { ZodError } from "@gym-tracker-pwa/schemas";
import { ErrorCode, HttpException } from "./exceptions";
import { BadRequestException } from "./exceptions/bad-request";
import { InternalException } from "./exceptions/internal-exception";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: any;
      if (exception instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException("Unprocessable entity", ErrorCode.UNPROCESSABLE_ENTITY, error.issues[0].message);
        } else {
          exception = new InternalException("Something went wrong", error, ErrorCode.INTERNAL_EXCEPTION);
        }
      }
      next(exception);
    }
  };
};
