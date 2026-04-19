import { Request, Response } from "express";
import { ApiWorkoutPlanSchema, FullOnboarding } from "@gym-tracker-pwa/schemas";
import { prismaClient } from "@/clients";
import { BadRequestException } from "../exceptions/bad-request";
import { calculateWorkoutPlanCalories, calculateWorkoutPlanDuration, mapMusclesToFocusArea } from "../helpers";
import { ErrorCode, HttpException } from "../exceptions";
import { InternalException } from "../exceptions/internal-exception";
import { NotFoundException } from "../exceptions/not-found";
import exerciseApiService from "../services/exerciseApi.service";
import openAiApiService from "../services/openAiApi.service";

export const getAllWorkoutPlans = async (req: Request, res: Response) => {
  const userId = req.userId;

  const userWorkoutPlans = await prismaClient.workoutPlan.findMany({ where: { userId } });

  res.status(200).json(userWorkoutPlans);
};

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { days, description, exercises, name, primaryMuscles } = ApiWorkoutPlanSchema.parse(req.body);

  const createdWorkoutPlan = await prismaClient
    .$transaction(async (tx) => {
      const onboarding = await prismaClient.onboarding.findUnique({ where: { userId } });
      if (!onboarding) {
        throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
      }

      const { activityLevel, age, gender, height, restTime, weight } = onboarding;

      const duration = calculateWorkoutPlanDuration(exercises, restTime);
      const calories = calculateWorkoutPlanCalories(activityLevel as FullOnboarding["activityLevel"], age, gender as FullOnboarding["gender"], height, weight, duration);

      const workoutPlan = await tx.workoutPlan.create({
        data: {
          userId,
          description,
          calories,
          duration,
          focusArea: mapMusclesToFocusArea(primaryMuscles),
          name,
          days,
        },
      });

      await tx.workoutPlanExercise.createMany({
        data: exercises.map((exercise) => ({
          workoutPlanId: workoutPlan.id,
          ...exercise,
        })),
      });

      return workoutPlan;
    })
    .catch((error) => {
      if (error instanceof HttpException) throw error;
      throw new InternalException("Something went wrong while creating workout plan", error, ErrorCode.INTERNAL_EXCEPTION);
    });

  res.status(201).json(createdWorkoutPlan);
};

export const createWithAI = async (req: Request, res: Response) => {
  const userId = req.userId;

  const onboarding = await prismaClient.onboarding.findUnique({ where: { userId } });
  if (!onboarding) {
    throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);
  }

  const aiWorkoutPlan = await openAiApiService.createWorkoutPlan(onboarding as FullOnboarding);

  if (aiWorkoutPlan === null) {
    throw new InternalException("AI workout plan creation failed", null, ErrorCode.OPEN_AI_ERROR);
  }

  const { activityLevel, age, gender, height, restTime, weight } = onboarding;

  const duration = calculateWorkoutPlanDuration(aiWorkoutPlan.exercises, restTime);
  const calories = calculateWorkoutPlanCalories(activityLevel as FullOnboarding["activityLevel"], age, gender as FullOnboarding["gender"], height, weight, duration);

  const createdWorkoutPlan = await prismaClient
    .$transaction(async (tx) => {
      const workoutPlan = await tx.workoutPlan.create({
        data: {
          userId,
          ai: true,
          description: aiWorkoutPlan.description,
          calories,
          duration,
          focusArea: aiWorkoutPlan.focusArea,
          name: aiWorkoutPlan.name,
          days: aiWorkoutPlan.days,
        },
      });

      await tx.workoutPlanExercise.createMany({
        data: aiWorkoutPlan.exercises.map((exercise) => ({
          workoutPlanId: workoutPlan.id,
          ...exercise,
        })),
      });

      return workoutPlan;
    })
    .catch((error) => {
      if (error instanceof HttpException) throw error;
      throw new InternalException("Something went wrong while creating workout plan", error, ErrorCode.INTERNAL_EXCEPTION);
    });

  res.status(201).json(createdWorkoutPlan);
};

export const patch = async (req: Request, res: Response) => {
  const { id: workoutPlanId } = req.params;
  const userId = req.userId;
  const workoutPlanIdNumber = Number(workoutPlanId);

  const { days, description, exercises, name, primaryMuscles } = ApiWorkoutPlanSchema.partial({ name: true, description: true, days: true }).parse(req.body);

  const [workoutPlan, onboarding] = await Promise.all([
    prismaClient.workoutPlan.findFirst({
      where: { id: workoutPlanIdNumber, userId },
      include: { exercises: true },
    }),
    prismaClient.onboarding.findUnique({ where: { userId } }),
  ]);

  if (!workoutPlan) throw new NotFoundException("Workout plan data is missing", ErrorCode.WORKOUT_PLAN_MISSING);
  if (!onboarding) throw new NotFoundException("Onboarding data is missing", ErrorCode.USER_ONBOARDING_MISSING);

  const { activityLevel, age, gender, height, restTime, weight } = onboarding;

  const updatedDuration = calculateWorkoutPlanDuration(exercises, restTime);
  const updatedCalories = calculateWorkoutPlanCalories(activityLevel as FullOnboarding["activityLevel"], age, gender as FullOnboarding["gender"], height, weight, updatedDuration);

  const updatedWorkoutPlan = await prismaClient
    .$transaction(async (tx) => {
      await tx.workoutPlanExercise.deleteMany({ where: { workoutPlanId: workoutPlanIdNumber } });

      await tx.workoutPlanExercise.createMany({
        data: exercises.map((exercise) => ({
          workoutPlanId: workoutPlan.id,
          ...exercise,
        })),
      });

      const updatedWorkoutPlanResult = await tx.workoutPlan.update({
        where: { id: workoutPlanIdNumber },
        data: { calories: updatedCalories, days, description, duration: updatedDuration, focusArea: mapMusclesToFocusArea(primaryMuscles), name },
        include: { exercises: true },
      });

      return updatedWorkoutPlanResult;
    })
    .catch((error) => {
      if (error instanceof HttpException) throw error;
      throw new InternalException("Something went wrong while updating workout plan", error, ErrorCode.INTERNAL_EXCEPTION);
    });

  return res.status(200).json(updatedWorkoutPlan);
};

export const getWorkoutPlan = async (req: Request, res: Response) => {
  const { id: workoutPlanId } = req.params;

  if (!workoutPlanId) {
    throw new BadRequestException("Workout plan id is required", ErrorCode.MISSING_ID);
  }

  const workoutPlan = await prismaClient.workoutPlan.findUnique({
    where: { id: Number(workoutPlanId) },
    include: {
      exercises: true,
    },
  });

  const exerciseApiCodes = workoutPlan?.exercises.map(({ exerciseApiCode }) => exerciseApiCode) || [];
  const exercisesMap = await exerciseApiService.getExercisesByCodes(exerciseApiCodes);

  const exercisesWithDetails = workoutPlan?.exercises.map((exercise) => ({
    ...exercisesMap.get(exercise.exerciseApiCode),
    ...exercise,
  }));

  res.status(200).json({ ...workoutPlan, exercises: exercisesWithDetails });
};
