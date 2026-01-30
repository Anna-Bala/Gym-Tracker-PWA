import { describe, expect, test } from "vitest";

import { calculateBMI, calculateBmiNeedlePosition, formatChartData, getDateRange } from "@/pages/report/utils";
import { getCurrentDayIso, formatDate } from "@/lib/utils";
import { workoutHistory } from "./fixtures/workoutHistory";

test("getCurrentDayIso function returns 6 as current day", () => {
  expect(getCurrentDayIso()).toBe(6);
});

describe("formatDate function", () => {
  test("should return current date in 'YYYY-MM-DD' format", () => {
    expect(formatDate(new Date())).toBe("2026-01-24");
  });

  test("should return custom date in 'YYYY-MM-DD' format", () => {
    expect(formatDate(new Date(2001, 0, 21))).toBe("2001-01-21");
  });
});

describe("calculateBMI function", () => {
  test("should return underweight value for 160cm and 45kg", () => {
    expect(calculateBMI(45, 160)).toBe(17.6);
  });

  test("should return healthy value for 190cm and 90kg", () => {
    expect(calculateBMI(90, 190)).toBe(24.9);
  });

  test("should return overweight value for 170cm and 75kg", () => {
    expect(calculateBMI(75, 170)).toBe(26.0);
  });

  test("should return obesity value for 200cm and 120kg", () => {
    expect(calculateBMI(120, 200)).toBe(30.0);
  });

  test("should return morbid obesity value for 180cm and 150kg", () => {
    expect(calculateBMI(150, 180)).toBeGreaterThan(40.0);
  });
});

describe("calculateBmiNeedlePosition function", () => {
  test("should return underweight needle position value", () => {
    expect(calculateBmiNeedlePosition(18.4)).toBe(0);
  });

  test("should return healthy needle position value - lower bound", () => {
    expect(calculateBmiNeedlePosition(18.5)).toBe(1);
  });

  test("should return healthy needle position value - upper bound", () => {
    expect(calculateBmiNeedlePosition(24.9)).toBe(1);
  });

  test("should return overweight needle position value - lower bound", () => {
    expect(calculateBmiNeedlePosition(25)).toBe(2);
  });

  test("should return overweight needle position value - upper bound", () => {
    expect(calculateBmiNeedlePosition(29.9)).toBe(2);
  });

  test("should return obesity needle position value - lower bound", () => {
    expect(calculateBmiNeedlePosition(30)).toBe(3);
  });

  test("should return obesity needle position value - upper bound", () => {
    expect(calculateBmiNeedlePosition(39.9)).toBe(3);
  });

  test("should return morbid obesity needle position value", () => {
    expect(calculateBmiNeedlePosition(40)).toBe(4);
  });
});

describe("getDateRange function", () => {
  test("should return '2026-01-19' as from date and '2026-01-25' as end date", () => {
    expect(getDateRange("1w")).toStrictEqual({
      fromDate: new Date("2026-01-19T00:00:00.000Z"),
      toDate: new Date("2026-01-25T23:59:59.999Z"),
    });
  });

  test("should return '2026-01-01' as from date and '2026-01-31' as end date", () => {
    expect(getDateRange("1m")).toStrictEqual({
      fromDate: new Date("2026-01-01T00:00:00.000Z"),
      toDate: new Date("2026-01-31T23:59:59.999Z"),
    });
  });

  test("should return '2025-11-01' as from date and '2026-01-24' as end date", () => {
    expect(getDateRange("3m")).toStrictEqual({
      fromDate: new Date("2025-11-01T00:00:00.000Z"),
      toDate: new Date("2026-01-24T23:59:59.999Z"),
    });
  });

  test("should return '2025-08-01' as from date and '2026-01-24' as end date", () => {
    expect(getDateRange("6m")).toStrictEqual({
      fromDate: new Date("2025-08-01T00:00:00.000Z"),
      toDate: new Date("2026-01-24T23:59:59.999Z"),
    });
  });
});

describe("formatChartData function", () => {
  test("should return correctly formated data for one workout history entry", () => {
    expect(formatChartData([workoutHistory])).toStrictEqual({ workouts: 1, calories: 360, minutes: 16 });
  });

  test("should return correctly formated data for multiple workout history entries", () => {
    expect(formatChartData([workoutHistory, workoutHistory])).toStrictEqual({ workouts: 2, calories: 720, minutes: 33 });
  });
});
