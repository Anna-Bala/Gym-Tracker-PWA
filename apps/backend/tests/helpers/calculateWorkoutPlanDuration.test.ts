import { describe, expect, test } from "vitest";

import { calculateWorkoutPlanDuration } from "@/helpers";
import { exercise1, exercise2 } from "../fixtures/exercise";

describe("calculateWorkoutPlanDuration function", () => {
  test("returns 192 seconds when workout exercise lasts for 12 reps and 4 sets when rest time is 0s", () => {
    const result = calculateWorkoutPlanDuration([exercise1], 0);
    expect(result).toStrictEqual(192);
  });

  test("returns 300 seconds when workout exercise lasts for 15 reps and 3 sets when rest time is 0s", () => {
    const result = calculateWorkoutPlanDuration([exercise2], 0);
    expect(result).toStrictEqual(180);
  });

  test("returns 282 seconds when workout exercise lasts for 12 reps and 4 sets when rest time is 30s", () => {
    const result = calculateWorkoutPlanDuration([exercise1], 30);
    expect(result).toStrictEqual(282);
  });

  test("returns 300 seconds when workout exercise lasts for 15 reps and 3 sets when rest time is 60s", () => {
    const result = calculateWorkoutPlanDuration([exercise2], 60);
    expect(result).toStrictEqual(300);
  });
});
