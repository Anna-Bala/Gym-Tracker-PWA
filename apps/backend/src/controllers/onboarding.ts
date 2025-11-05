import { Request, Response } from "express";
import { FullOnboardingSchema } from "@gym-tracker-pwa/schemas";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";
import { prismaClient } from "..";

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { activityLevel, age, days, fitnessLevel, focusArea, gender, height, weight, workoutGoal } = FullOnboardingSchema.parse(req.body);

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });
  if (onboarding) {
    throw new BadRequestException("Onboarding has been already created for this user", ErrorCode.USER_ONBOARDING_ALREADY_EXISTS);
  }

  onboarding = await prismaClient.onboarding.create({
    data: {
      activityLevel,
      age,
      days,
      fitnessLevel,
      focusArea,
      gender,
      height,
      userId,
      weight,
      workoutGoal,
    },
  });

  res.json(onboarding);
};
