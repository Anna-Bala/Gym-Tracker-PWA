import * as jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../secrets";

export const signAccessToken = (userId: number) => jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

export const signRefreshToken = (userId: number) => jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyRefreshToken = (token: any) => jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
