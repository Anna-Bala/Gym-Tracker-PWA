import { Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import { BadRequestException } from "../exceptions/bad-request";
import { ChangePasswordSchema, UserPersonalInfoSchema, UserThemeSchema } from "@gym-tracker-pwa/schemas";
import { prismaClient } from "@/clients";
import { ErrorCode } from "../exceptions";
import { NotFoundException } from "../exceptions/not-found";

export const get = async (req: Request, res: Response) => {
  const userId = req.userId;

  let user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const { password: responseUserPassword, ...responseUser } = user;

  res.status(200).json(responseUser);
};

export const patch = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { email, firstName, lastName } = UserPersonalInfoSchema.parse(req.body);

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

export const deleteAllUserRelatedData = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    await prismaClient.user.delete({
      where: { id: userId },
    });

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete account" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);

  if (!currentPassword || !newPassword) {
    throw new BadRequestException("Both current and new password are required", ErrorCode.MISSING_PASSWORD);
  }

  try {
    await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: req.userId },
      });

      if (!user) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);

      const isCurrentPasswordCorrect = await compareSync(currentPassword, user.password!);
      if (!isCurrentPasswordCorrect) {
        throw new BadRequestException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);
      }

      const newPasswordHash = hashSync(newPassword, 10);

      await tx.user.update({
        where: { id: userId },
        data: { password: newPasswordHash },
      });

      await tx.refreshToken.deleteMany({ where: { userId } });

      return true;
    });

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to change password" });
  }
};

export const changeTheme = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { theme } = UserThemeSchema.parse(req.body);

  let user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    if (!user) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const { theme: newThemePreference } = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      theme,
    },
  });

  return res.status(200).json({
    theme: newThemePreference,
  });
};

export const getUserStatistics = async (req: Request, res: Response) => {
  const userId = req.userId;

  let onboarding = await prismaClient.onboarding.findUnique({ where: { userId } });
  if (!onboarding) {
    throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  const workoutHistoryStatistics = await prismaClient.workoutHistory.aggregate({
    where: { userId },
    _count: { id: true },
    _sum: { calories: true, duration: true },
  });

  const totalWorkouts = workoutHistoryStatistics._count.id;
  const totalCalories = workoutHistoryStatistics._sum.calories || 0;
  const totalDuration = workoutHistoryStatistics._sum.duration || 0;

  res.json({ totalCalories, totalDuration, totalWorkouts, height: onboarding?.height || 0, weight: onboarding?.weight || 0 });
};
