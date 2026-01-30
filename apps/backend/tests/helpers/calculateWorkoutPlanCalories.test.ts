import { describe, expect, test } from "vitest";

import { calculateWorkoutPlanCalories } from "@/helpers";

describe("calculateWorkoutPlanCalories function", () => {
  test("returns 601 calories for an 1 hour workout plan for 40 years old overweight woman", () => {
    const calories = calculateWorkoutPlanCalories("sedentary", 40, "F", 190, 100, 3600);
    expect(calories).toStrictEqual(601);
  });

  test("returns 1068 calories for an 1 hour workout plan for 40 years old overweight man", () => {
    const calories = calculateWorkoutPlanCalories("athlete", 40, "M", 190, 120, 3600);
    expect(calories).toStrictEqual(1068);
  });

  test("returns 190 calories for an 30 minutes workout plan for 18 years old woman", () => {
    const calories = calculateWorkoutPlanCalories("moderate", 18, "F", 160, 50, 1800);
    expect(calories).toStrictEqual(190);
  });

  test("returns 338 calories for an 30 minutes workout plan for 18 years old man", () => {
    const calories = calculateWorkoutPlanCalories("moderate", 18, "M", 200, 90, 1800);
    expect(calories).toStrictEqual(338);
  });
});
