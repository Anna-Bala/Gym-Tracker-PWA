import fetch from "node-fetch";
import { Request, Response } from "express";
import { Exercise, FilterExercisesSchema, SearchExercisesSchema } from "@gym-tracker-pwa/schemas";
import { ErrorCode } from "../exceptions";
import { InternalException } from "../exceptions/internal-exception";
import { WORKOUT_API_KEY } from "../secrets";

const appendImagesToExerciseResults = async (exercises: Exercise[]) => {
  const searchResultWithImages = await Promise.all(
    exercises.map(async (result) => {
      const imageResponse = await fetch(`https://api.workoutapi.com/exercises/${result.id}/image`, {
        method: "GET",
        headers: { Accept: "image/png", "x-api-key": WORKOUT_API_KEY },
      });

      const imageBuffer = await imageResponse.arrayBuffer();
      const imageAsBase64 = Buffer.from(imageBuffer).toString("base64");

      return {
        ...result,
        image: `data:${imageResponse.headers.get("content-type")};base64,${imageAsBase64}`,
      };
    })
  );

  return searchResultWithImages;
};

export const getAllExercises = async (_req: Request, res: Response) => {
  try {
    const allExercisesResponse = await fetch("https://api.workoutapi.com/exercises", {
      method: "GET",
      headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
    });

    const allExercisesResponseResult = ((await allExercisesResponse.json()) || []) as Exercise[];
    const allExercisesResultWithImages = await appendImagesToExerciseResults(allExercisesResponseResult);

    res.json(allExercisesResultWithImages);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};

export const getExercisesByName = async (req: Request, res: Response) => {
  const { name } = SearchExercisesSchema.parse(req.body);

  try {
    const searchResponse = await fetch(`https://api.workoutapi.com/exercises/search?q=${name}`, {
      method: "GET",
      headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
    });

    const searchResponseResult = ((await searchResponse.json()) || []) as Exercise[];
    const searchResultWithImages = await appendImagesToExerciseResults(searchResponseResult);

    res.json(searchResultWithImages);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};

export const getFilteredExercises = async (req: Request, res: Response) => {
  const { categories, muscles, types } = FilterExercisesSchema.parse(req.body);

  try {
    const filterResponse = await fetch("https://api.workoutapi.com/exercises/filter", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "x-api-key": WORKOUT_API_KEY },
      body: JSON.stringify({
        muscles,
        categories,
        types,
      }),
    });

    const filterResponseResult = ((await filterResponse.json()) || []) as Exercise[];
    const filterResultWithImages = await appendImagesToExerciseResults(filterResponseResult);

    res.json(filterResultWithImages);
  } catch (error) {
    throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
  }
};
