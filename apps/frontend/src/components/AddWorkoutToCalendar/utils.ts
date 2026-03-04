import { formatDate } from "@/lib/utils";

const CALENDAR_SERIES_MONTHS_AHEAD = 1;
const DAYS_IN_WEEK = 7;

export const generateWorkoutPlanScheduleForCalendar = (dayNumbers: string[], eventName: string, startTime: string): { name: string; startDate: string }[] => {
  const dayNumbersAsNumbers = [...new Set(dayNumbers.map(Number))];

  const [hours, minutes] = startTime.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return [];
  }

  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + CALENDAR_SERIES_MONTHS_AHEAD);
  endDate.setHours(23, 59, 59, 999);
  const occurrences: { name: string; startDate: string }[] = [];

  dayNumbersAsNumbers.forEach((day) => {
    const currentOccurrence = new Date(now);
    const targetJsWeekday = day % DAYS_IN_WEEK;
    const daysUntilWorkout = (targetJsWeekday - now.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK;

    currentOccurrence.setDate(currentOccurrence.getDate() + daysUntilWorkout);
    currentOccurrence.setHours(hours, minutes, 0, 0);

    if (currentOccurrence <= now) {
      currentOccurrence.setDate(currentOccurrence.getDate() + DAYS_IN_WEEK);
    }

    while (currentOccurrence <= endDate) {
      occurrences.push({
        name: eventName,
        startDate: formatDate(currentOccurrence),
      });
      currentOccurrence.setDate(currentOccurrence.getDate() + DAYS_IN_WEEK);
    }
  });

  return occurrences.sort((firstOccurrence, secondOccurrence) => firstOccurrence.startDate.localeCompare(secondOccurrence.startDate));
};
