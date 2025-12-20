import { Request, Response } from "express";
import { ApiWorkoutPlanSchema } from "@gym-tracker-pwa/schemas";
import { calculateWorkoutPlanDuration, mapMusclesToFocusArea } from "../helpers";
import { ErrorCode } from "../exceptions";
import { InternalException } from "../exceptions/internal-exception";
import { prismaClient } from "..";

export const getAllWorkoutPlans = async (req: Request, res: Response) => {
  const userId = req.userId;

  const userWorkoutPlans = await prismaClient.workoutPlan.findMany({ where: { userId } });

  res.status(200).json(userWorkoutPlans);
};

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { description, exercises, primaryMuscles, name } = ApiWorkoutPlanSchema.parse(req.body);

  const createdWorkoutPlan = await prismaClient
    .$transaction(async (tx) => {
      const workoutPlan = await tx.workoutPlan.create({
        data: {
          userId,
          description,
          duration: calculateWorkoutPlanDuration(exercises),
          focusArea: mapMusclesToFocusArea(primaryMuscles),
          name,
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
