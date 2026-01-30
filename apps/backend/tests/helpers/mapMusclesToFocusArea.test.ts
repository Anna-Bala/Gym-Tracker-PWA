import { describe, expect, test } from "vitest";

import { mapMusclesToFocusArea } from "@/helpers";

describe("mapMusclesToFocusArea function", () => {
  test("returns full body for different area muscles", () => {
    const muscles = ["Back", "Forearms", "Abdominals", "Glutes"];
    expect(mapMusclesToFocusArea(muscles)).toContain("fullBody");
  });

  test("returns legs and arms", () => {
    const muscles = ["Glutes", "Quadriceps", "Forearms"];
    expect(mapMusclesToFocusArea(muscles)).toStrictEqual(["legs", "arms"]);
  });

  test("returns back and stomach", () => {
    const muscles = ["Trapezius", "Back", "Obliques"];
    expect(mapMusclesToFocusArea(muscles)).toStrictEqual(["back", "stomach"]);
  });

  test("returns chest", () => {
    const muscles = ["Chest"];
    expect(mapMusclesToFocusArea(muscles)).toStrictEqual(["chest"]);
  });

  test("returns arms and chest", () => {
    const muscles = ["Triceps", "Biceps", "Chest"];
    expect(mapMusclesToFocusArea(muscles)).toStrictEqual(["arms", "chest"]);
  });
});
