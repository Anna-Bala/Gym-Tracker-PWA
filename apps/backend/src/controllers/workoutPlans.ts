import { Request, Response } from "express";
import { ApiWorkoutPlanSchema, FullOnboarding } from "@gym-tracker-pwa/schemas";
import { BadRequestException } from "../exceptions/bad-request";
import { calculateWorkoutPlanCalories, calculateWorkoutPlanDuration, mapMusclesToFocusArea } from "../helpers";
import { ErrorCode } from "../exceptions";
import { ExerciseApiService } from "../services/exerciseApi.service";
import { InternalException } from "../exceptions/internal-exception";
import { NotFoundException } from "../exceptions/not-found";
import { prismaClient } from "..";

export const exerciseApiService = new ExerciseApiService();

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
      throw new InternalException("Something went wrong while creating workout plan", error, ErrorCode.INTERNAL_EXCEPTION);
    });

  res.json(createdWorkoutPlan);
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

  const exerciseApiIds = workoutPlan?.exercises.map(({ exerciseApiId }) => exerciseApiId) || [];
  const exercisesMap = await exerciseApiService.getExercisesByIds(exerciseApiIds);

  const exercisesWithDetails = workoutPlan?.exercises.map((exercise) => ({
    ...exercise,
    ...exercisesMap.get(exercise.exerciseApiId),
  }));

  res.status(200).json({ ...workoutPlan, exercises: exercisesWithDetails });
};
