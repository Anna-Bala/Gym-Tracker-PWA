import { Request, Response } from "express";
import { BodyMetricsSchema, FullOnboardingSchema } from "@gym-tracker-pwa/schemas";
import { prismaClient } from "@/clients";
import { ConflictException } from "../exceptions/conflict";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions";

export const get = async (req: Request, res: Response) => {
  const userId = req.userId;

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });
  if (!onboarding) {
    throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  res.json(onboarding);
};

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { activityLevel, age, days, fitnessLevel, focusArea, gender, height, weight, workoutGoal, restTime } = FullOnboardingSchema.parse(req.body);

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });
  if (onboarding) {
    throw new ConflictException("Onboarding has been already created for this user", ErrorCode.USER_ONBOARDING_ALREADY_EXISTS);
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
      restTime,
    },
  });

  res.status(201).json(onboarding);
};

export const patch = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { age, gender, height, weight } = BodyMetricsSchema.parse(req.body);

  let onboarding = await prismaClient.onboarding.findFirst({ where: { userId } });
  if (!onboarding) {
    throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  const {
    age: newAge,
    gender: newGender,
    height: newHeight,
    weight: newWeight,
  } = await prismaClient.onboarding.update({
    where: {
      id: onboarding.id,
    },
    data: {
      age,
      gender,
      height,
      weight,
    },
  });

  return res.status(200).json({
    age: newAge,
    gender: newGender,
    height: newHeight,
    weight: newWeight,
  });
};
