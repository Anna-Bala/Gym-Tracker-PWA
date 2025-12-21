import { Request, Response } from "express";
import { FilterExercisesSchema, SearchExercisesSchema } from "@gym-tracker-pwa/schemas";
import { ErrorCode } from "../exceptions";
import { ExerciseApiService } from "../services/exerciseApi.service";
import { InternalException } from "../exceptions/internal-exception";

export const exerciseApiService = new ExerciseApiService();

export const getAllExercises = async (_req: Request, res: Response) => {
  try {
    const allExercises = await exerciseApiService.getAllExercises();
    res.json(allExercises);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};

export const getExercisesByName = async (req: Request, res: Response) => {
  const { name = "" } = SearchExercisesSchema.parse(req.body);

  try {
    const foundExercises = await exerciseApiService.searchExercises(name);
    res.json(foundExercises);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};

export const getFilteredExercises = async (req: Request, res: Response) => {
  const { categories, muscles, types } = FilterExercisesSchema.parse(req.body);

  try {
    const filteredExercises = await exerciseApiService.filterExercises(muscles, categories, types);
    res.json(filteredExercises);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};
