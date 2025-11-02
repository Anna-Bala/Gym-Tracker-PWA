import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { verifyAccessToken } from "../helpers";

export const authenticateToken = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  try {
    verifyAccessToken(accessToken);
    next();
  } catch {
    throw new UnauthorizedException("Invalid or expired refresh token", ErrorCode.INVALID_TOKEN);
  }
};
