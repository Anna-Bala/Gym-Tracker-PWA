import { Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { SignupSchema } from "@gym-tracker-pwa/schemas";
import { prismaClient } from "..";
import { ENVIRONMENT } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";
import { NotFoundException } from "../exceptions/not-found";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers";

export const signup = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = SignupSchema.parse(req.body);

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashSync(password, 10),
    },
  });

  const { password: responseUserPassword, ...responseUser } = user;
  res.json(responseUser);
};

const tokenLifetime = 7 * 24 * 3600 * 1000;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  if (!compareSync(password, user.password)) throw new BadRequestException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + tokenLifetime),
    },
  });

  res.cookie("session", refreshToken, {
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: tokenLifetime,
  });

  const { createdAt, updatedAt, password: responseUserPassword, ...responseUser } = user;

  res.json({ user: responseUser, token: accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.session;
  if (!refreshToken) throw new UnauthorizedException("Token missing", ErrorCode.MISSING_TOKEN);

  const dbRefreshToken = await prismaClient.refreshToken.findFirst({ where: { token: refreshToken } });
  if (!dbRefreshToken || dbRefreshToken.revoked) throw new UnauthorizedException("Invalid token", ErrorCode.INVALID_TOKEN);

  try {
    const jwtPayload = verifyRefreshToken(refreshToken) as JwtPayload;
    const newRefreshToken = signRefreshToken(Number(jwtPayload.userId));

    await prismaClient.$transaction([
      prismaClient.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true },
      }),
      prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: Number(jwtPayload.userId),
          expiresAt: new Date(Date.now() + tokenLifetime),
        },
      }),
    ]);

    res.cookie("session", refreshToken, {
      httpOnly: true,
      secure: ENVIRONMENT === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: tokenLifetime,
    });

    const accessToken = signAccessToken(Number(jwtPayload.userId));
    res.json({ token: accessToken });
  } catch {
    throw new UnauthorizedException("Invalid or expired refresh token", ErrorCode.INVALID_TOKEN);
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.session;

  if (refreshToken) {
    await prismaClient.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
    res.clearCookie("session", { path: "/api/auth/refresh" });
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
};
