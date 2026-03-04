import { type TimeValue } from ".";

export const formatTimeDisplay = ({ hour, minute, period }: TimeValue) => `${hour}:${minute} ${period}`;

export const to24HourTime = ({ hour, minute, period }: TimeValue) => {
  const normalizedHour = Number(hour) % 12;
  const formattedHour = period === "PM" ? normalizedHour + 12 : normalizedHour;

  return `${String(formattedHour).padStart(2, "0")}:${minute}`;
};

export const toMinutes = ({ hour, minute, period }: TimeValue) => {
  const [hours, minutes] = to24HourTime({ hour, minute, period }).split(":").map(Number);

  return hours * 60 + minutes;
};
