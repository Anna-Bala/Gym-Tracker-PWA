import { Request, Response } from "express";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";
import { prismaClient } from "..";

export const get = async (req: Request, res: Response) => {
  const userId = req.userId;

  let user = await prismaClient.user.findFirst({ where: { id: userId } });
  if (!user) {
    throw new BadRequestException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const { password: responseUserPassword, ...responseUser } = user;

  res.json(responseUser);
};

export const getUserStatistics = async (req: Request, res: Response) => {
  const userId = req.userId;

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });
  if (!onboarding) {
    throw new BadRequestException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  res.json({ height: onboarding?.height || 0, weight: onboarding?.weight || 0 });
};
