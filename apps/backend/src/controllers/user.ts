import { Request, Response } from "express";
import { UserUpdateSchema } from "@gym-tracker-pwa/schemas";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions";
import { prismaClient } from "..";

export const get = async (req: Request, res: Response) => {
  const userId = req.userId;

  let user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const { password: responseUserPassword, ...responseUser } = user;

  res.json(responseUser);
};

export const patch = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { email, firstName, lastName } = UserUpdateSchema.parse(req.body);

  let user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    if (!user) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const {
    email: newEmail,
    firstName: newFirstName,
    lastName: newLastName,
  } = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      firstName,
      lastName,
    },
  });

  return res.status(200).json({
    email: newEmail,
    firstName: newFirstName,
    lastName: newLastName,
  });
};

export const getUserStatistics = async (req: Request, res: Response) => {
  const userId = req.userId;

  let onboarding = await prismaClient.onboarding.findUnique({ where: { userId } });
  if (!onboarding) {
    throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  res.json({ height: onboarding?.height || 0, weight: onboarding?.weight || 0 });
};
