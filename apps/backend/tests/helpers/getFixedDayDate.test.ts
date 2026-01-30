import { describe, expect, test } from "vitest";

import { getStartOfTheDayDate, getEndOfTheDayDate } from "@/helpers";

describe("getStartOfTheDayDate function", () => {
  test("returns correctly fixed start date for current date", () => {
    const result = getStartOfTheDayDate(new Date());
    expect(result).toStrictEqual(new Date("2026-01-24T00:00:00Z"));
  });

  test("returns correctly fixed start date for custom date", () => {
    const result = getStartOfTheDayDate(new Date(2020, 0, 26));
    expect(result).toStrictEqual(new Date("2020-01-26T00:00:00Z"));
  });
});

describe("getEndOfTheDayDate function", () => {
  test("returns correctly fixed end date for current date", () => {
    const result = getEndOfTheDayDate(new Date());
    expect(result).toStrictEqual(new Date("2026-01-24T23:59:59.999Z"));
  });

  test("returns correctly fixed end date for custom date", () => {
    const result = getEndOfTheDayDate(new Date(2020, 0, 26));
    expect(result).toStrictEqual(new Date("2020-01-26T23:59:59.999Z"));
  });
});
