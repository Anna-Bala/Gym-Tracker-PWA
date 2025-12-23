export const getStartOfTheDayDate = (date: Date) => {
  const fixedDate = new Date(date);
  fixedDate.setUTCHours(0, 0, 0, 0);
  return fixedDate;
};

export const getEndOfTheDayDate = (date: Date) => {
  const fixedDate = new Date(date);
  fixedDate.setUTCHours(23, 59, 59, 999);
  return fixedDate;
};
