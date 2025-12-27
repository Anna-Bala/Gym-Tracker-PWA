import { Request, Response } from "express";
import { WorkoutHistoryCreationSchema } from "@gym-tracker-pwa/schemas";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";
import { getEndOfTheDayDate, getStartOfTheDayDate } from "../helpers";
import { InternalException } from "../exceptions/internal-exception";
import { NotFoundException } from "../exceptions/not-found";
import { prismaClient } from "..";

export const get = async (req: Request, res: Response) => {
  const userId = req.userId;

  const fromDate = req.query.from ? getStartOfTheDayDate(new Date(req.query.from as string)) : undefined;
  const toDate = req.query.to ? getEndOfTheDayDate(new Date(req.query.to as string)) : undefined;

  if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
    throw new BadRequestException("Invalid date format", ErrorCode.INVALID_DATE);
  }

  let workoutHistory =
    (await prismaClient.workoutHistory.findMany({
      where: {
        userId,
        createdAt: {
          ...(fromDate && { gte: fromDate }),
          ...(toDate && { lte: toDate }),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        workoutPlan: {
          select: {
            id: true,
            focusArea: true,
            name: true,
          },
        },
      },
    })) || [];

  res.status(200).json(workoutHistory);
};

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { workoutPlanId } = WorkoutHistoryCreationSchema.parse(req.body);

  if (!workoutPlanId) {
    throw new BadRequestException("Workout plan id is required", ErrorCode.MISSING_ID);
  }

  const createdWorkoutHistory = await prismaClient
    .$transaction(async (tx) => {
      const workoutPlan = await tx.workoutPlan.findUnique({ where: { id: workoutPlanId } });

      if (!workoutPlan) {
        throw new NotFoundException("Workout plan data is missing", ErrorCode.WORKOUT_PLAN_MISSING);
      }

      const workoutHistory = await tx.workoutHistory.create({
        data: {
          calories: workoutPlan.calories,
          duration: workoutPlan.duration,
          userId,
          workoutPlanId,
        },
      });

      return workoutHistory;
    })
    .catch((error) => {
      throw new InternalException("Something went wrong while creating workout plan history entry", error, ErrorCode.INTERNAL_EXCEPTION);
    });

  res.status(200).json(createdWorkoutHistory);
};
