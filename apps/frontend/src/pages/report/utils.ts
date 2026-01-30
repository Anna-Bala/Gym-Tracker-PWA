import type { WorkoutHistory } from "@gym-tracker-pwa/schemas";

export const calculateBMI = (weight: number, height: number) => {
  if (weight <= 0 || height <= 0) {
    return null;
  }

  const bmi = weight / ((height / 100) * (height / 100));

  return parseFloat(bmi.toFixed(1));
};

export const calculateBmiNeedlePosition = (bmi: number) => {
  if (bmi < 18.5) return 0;
  else if (bmi >= 18.5 && bmi <= 24.9) return 1;
  else if (bmi >= 25 && bmi <= 29.9) return 2;
  else if (bmi >= 30 && bmi <= 39.9) return 3;
  else if (bmi >= 40) return 4;
};

export const getDateRange = (range: string) => {
  const currentDate = new Date();
  const fromDate = new Date();
  let toDate = new Date(currentDate);

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  switch (range) {
    case "1w": {
      const day = currentDate.getDay();
      const daysDifference = day === 0 ? 6 : day - 1;
      fromDate.setDate(currentDate.getDate() - daysDifference);

      toDate = new Date(fromDate);
      toDate.setDate(fromDate.getDate() + 6);
      toDate.setHours(23, 59, 59, 999);
      break;
    }
    case "1m":
      fromDate.setDate(1);
      toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
      toDate.setHours(23, 59, 59, 999);
      break;
    case "3m":
      fromDate.setMonth(currentDate.getMonth() - 2, 1);
      break;
    case "6m":
      fromDate.setMonth(currentDate.getMonth() - 5, 1);
      break;
  }

  return { fromDate, toDate };
};

export const formatChartData = (workoutHistory: WorkoutHistory[]) => ({
  workouts: workoutHistory.length,
  calories: workoutHistory.reduce((totalCalories, workout) => totalCalories + (Number(workout.calories) || 0), 0),
  minutes: Math.round(workoutHistory.reduce((totalSeconds, workout) => totalSeconds + (Number(workout.duration) || 0), 0) / 60),
});
