import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../exceptions";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { verifyAccessToken } from "../helpers";

export const authenticateToken = async (req: Request, _res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;

  try {
    const decoded = verifyAccessToken(accessToken) as JwtPayload;
    if (!decoded.userId) throw new UnauthorizedException("User ID is missing", ErrorCode.MISSING_USER_ID);

    req.userId = decoded.userId;

    next();
  } catch {
    throw new UnauthorizedException("Invalid or expired refresh token", ErrorCode.INVALID_TOKEN);
  }
};
