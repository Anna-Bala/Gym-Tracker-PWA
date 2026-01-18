import { Exercise, FilterExercises } from "@gym-tracker-pwa/schemas";
import { WORKOUT_API_BASE_URL, WORKOUT_API_KEY } from "../secrets";
import { redisClient } from "..";

export class ExerciseApiService {
  private workoutApiDataCasheLifetime = 7 * 24 * 3600;

  async appendImagesToExerciseResults(exercises: Exercise[]) {
    const searchResultWithImages = await Promise.all(
      exercises.map(async (result) => {
        const exerciseImageCacheKey = `exercises:img:${result.code}`;

        const cachedImage = await redisClient.get(exerciseImageCacheKey);
        if (cachedImage) {
          return { ...result, image: cachedImage };
        }

        const imageResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises/${result.id}/image`, {
          method: "GET",
          headers: { Accept: "image/png", "x-api-key": WORKOUT_API_KEY },
        });

        const imageBuffer = await imageResponse.arrayBuffer();
        const imageAsBase64 = Buffer.from(imageBuffer).toString("base64");
        const imageFullData = `data:${imageResponse.headers.get("content-type")};base64,${imageAsBase64}`;

        await redisClient.set(exerciseImageCacheKey, imageFullData, { expiration: { type: "EX", value: this.workoutApiDataCasheLifetime } });

        return {
          ...result,
          image: imageFullData,
        };
      })
    );

    return searchResultWithImages;
  }

  async getAllExercises(skipImages?: boolean) {
    const exercisesCacheKey = `exercises:all:${skipImages ? "no-img" : "img"}`;

    const cachedData = await redisClient.get(exercisesCacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as Exercise[];
    }

    const allExercisesResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises`, {
      method: "GET",
      headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
    });

    const allExercisesResponseResult = ((await allExercisesResponse.json()) || []) as Exercise[];

    let result = [];
    if (skipImages) {
      result = allExercisesResponseResult;
    } else {
      result = await this.appendImagesToExerciseResults(allExercisesResponseResult);
    }

    await redisClient.set(exercisesCacheKey, JSON.stringify(result), { expiration: { type: "EX", value: this.workoutApiDataCasheLifetime } });

    return result;
  }

  async getExercisesByCodes(codes: string[]) {
    if (!codes.length) return new Map();

    const uniqueCodes = [...new Set(codes)];

    const responseResults = await Promise.allSettled(
      uniqueCodes.map((code) =>
        fetch(`${WORKOUT_API_BASE_URL}/exercises/code/${code}`, {
          method: "GET",
          headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
        })
      )
    );

    const exercises: Exercise[] = [];

    for (const responseResult of responseResults) {
      if (responseResult.status === "fulfilled" && responseResult.value.ok) {
        const exercise = (await responseResult.value.json()) as Exercise;
        exercises.push(exercise);
      }
    }

    const exercisesWithImages = await this.appendImagesToExerciseResults(exercises);

    return new Map(exercisesWithImages.map((exercise) => [exercise.code, exercise]));
  }

  async searchExercises(search: string) {
    const searchResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises/search?q=${search}`, {
      method: "GET",
      headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
    });

    const searchResponseResult = ((await searchResponse.json()) || []) as Exercise[];
    const searchResultWithImages = await this.appendImagesToExerciseResults(searchResponseResult);

    return searchResultWithImages;
  }

  async filterExercises(muscles: FilterExercises["muscles"], categories: FilterExercises["categories"], types: FilterExercises["types"]) {
    const filterResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises/filter`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "x-api-key": WORKOUT_API_KEY },
      body: JSON.stringify({
        muscles,
        categories,
        types,
      }),
    });

    const filterResponseResult = ((await filterResponse.json()) || []) as Exercise[];
    const filterResultWithImages = await this.appendImagesToExerciseResults(filterResponseResult);

    return filterResultWithImages;
  }
}

export default new ExerciseApiService();
