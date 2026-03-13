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

export const formatFocusArea = (focusArea: string[]) => {
  return focusArea
    .map((area) => {
      const detectUppercase = area.replace(/([A-Z])/g, " $1");
      return detectUppercase.charAt(0).toUpperCase() + detectUppercase.slice(1);
    })
    ?.join(" / ");
};
