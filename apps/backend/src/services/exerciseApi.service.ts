import { Exercise, FilterExercises } from "@gym-tracker-pwa/schemas";
import { WORKOUT_API_BASE_URL, WORKOUT_API_KEY } from "../secrets";

export class ExerciseApiService {
  async appendImagesToExerciseResults(exercises: Exercise[]) {
    const searchResultWithImages = await Promise.all(
      exercises.map(async (result) => {
        const imageResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises/${result.id}/image`, {
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
  }

  async getAllExercises() {
    const allExercisesResponse = await fetch(`${WORKOUT_API_BASE_URL}/exercises`, {
      method: "GET",
      headers: { Accept: "application/json", "x-api-key": WORKOUT_API_KEY },
    });

    const allExercisesResponseResult = ((await allExercisesResponse.json()) || []) as Exercise[];
    const allExercisesResultWithImages = await this.appendImagesToExerciseResults(allExercisesResponseResult);

    return allExercisesResultWithImages;
  }

  async getExercisesByIds(ids: string[]) {
    if (!ids.length) return new Map();

    const uniqueIds = [...new Set(ids)];

    const responseResults = await Promise.allSettled(
      uniqueIds.map((id) =>
        fetch(`${WORKOUT_API_BASE_URL}/exercises/${id}`, {
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

    return new Map(exercisesWithImages.map((exercise) => [exercise.id, exercise]));
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
