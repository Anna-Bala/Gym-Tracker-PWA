import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => new Intl.DateTimeFormat("en-CA").format(date);
export const getCurrentDayIso = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
};
