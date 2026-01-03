export const dateRangeOptions = {
  oneWeek: "1w",
  oneMonth: "1m",
  threeMonths: "3m",
  sixMonths: "6m",
} as const;

export const dateRangeSelectOptions = [
  { label: "This week", value: "1w" },
  { label: "This month", value: "1m" },
  { label: "Last three months", value: "3m" },
  { label: "Last six months", value: "6m" },
];
