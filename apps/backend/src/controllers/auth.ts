import { Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { SignupSchema } from "@gym-tracker-pwa/schemas";

import { ConflictException } from "../exceptions/conflict";
import { ENVIRONMENT } from "../secrets";
import { ErrorCode } from "../exceptions";
import { NotFoundException } from "../exceptions/not-found";
import { prismaClient } from "@/clients";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers";
import { UnauthorizedException } from "../exceptions/unauthorized";
import googleApiService from "@/services/googleApi.service";

const accessTokenLifetime = 30 * 60 * 1000;
const refreshTokenLifetime = 7 * 24 * 3600 * 1000;

const sendAuthTokens = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    sameSite: ENVIRONMENT === "production" ? "none" : "strict",
    maxAge: accessTokenLifetime,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: ENVIRONMENT === "production",
    sameSite: ENVIRONMENT === "production" ? "none" : "strict",
    path: "/api/auth",
    maxAge: refreshTokenLifetime,
  });
};

export const signup = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = SignupSchema.parse(req.body);

  let user = await prismaClient.user.findUnique({ where: { email } });
  if (user) {
    throw new ConflictException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashSync(password, 10),
      theme: null,
    },
  });

  const { password: responseUserPassword, ...responseUser } = user;
  res.status(201).json(responseUser);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  if (!compareSync(password, user.password)) throw new UnauthorizedException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + refreshTokenLifetime),
    },
  });

  sendAuthTokens(res, accessToken, refreshToken);

  const onboarding = await prismaClient.onboarding.findFirst({ where: { userId: user.id } });

  const { createdAt, updatedAt, password: responseUserPassword, ...responseUser } = user;

  res.json({ user: responseUser, onboardingFilled: !!onboarding });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) throw new UnauthorizedException("Token missing", ErrorCode.MISSING_TOKEN);

  const dbRefreshToken = await prismaClient.refreshToken.findFirst({ where: { token: refreshToken } });
  if (!dbRefreshToken || dbRefreshToken.revoked) throw new UnauthorizedException("Invalid token", ErrorCode.INVALID_TOKEN);

  try {
    const jwtPayload = verifyRefreshToken(refreshToken) as JwtPayload;
    const newRefreshToken = signRefreshToken(Number(jwtPayload.userId));

    await prismaClient.$transaction([
      prismaClient.refreshToken.delete({
        where: { token: refreshToken },
      }),
      prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: Number(jwtPayload.userId),
          expiresAt: new Date(Date.now() + refreshTokenLifetime),
        },
      }),
    ]);

    const accessToken = signAccessToken(Number(jwtPayload.userId));

    sendAuthTokens(res, accessToken, newRefreshToken);

    res.status(204).end();
  } catch {
    throw new UnauthorizedException("Invalid or expired refresh token", ErrorCode.INVALID_TOKEN);
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const { code } = req.body;

  const googleAuthPayload = await googleApiService.authenticateUser(code);

  if (!googleAuthPayload) {
    throw new UnauthorizedException("Google authentication failed", ErrorCode.GOOGLE_API_ERROR);
  }

  const { sub, email, given_name, family_name, name } = googleAuthPayload;

  const firstName = given_name || name?.split(" ")[0] || "Guest";
  const lastName = family_name || name?.split(" ")[1] || "User";

  const resolvedEmail = email || `${sub}@no-email.google.com`;
  const existingByGoogleId = await prismaClient.user.findUnique({ where: { googleId: sub } });

  const user = existingByGoogleId
    ? await prismaClient.user.update({
        where: { id: existingByGoogleId.id },
        data: { firstName, lastName },
      })
    : await prismaClient.user.upsert({
        where: { email: resolvedEmail },
        update: { googleId: sub, firstName, lastName },
        create: {
          googleId: sub,
          firstName,
          lastName,
          email: resolvedEmail,
          theme: null,
        },
      });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + refreshTokenLifetime),
    },
  });

  sendAuthTokens(res, accessToken, refreshToken);

  const onboarding = await prismaClient.onboarding.findFirst({ where: { userId: user.id } });

  const { createdAt, updatedAt, password: responseUserPassword, ...responseUser } = user;

  res.json({ user: responseUser, onboardingFilled: !!onboarding });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    await prismaClient.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/api/auth" });
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
};
