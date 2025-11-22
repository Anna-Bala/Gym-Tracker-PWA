export const calculateBMI = (weight: number, height: number) => {
  if (weight <= 0 || height <= 0) {
    return null;
  }

  const bmi = weight / (height * height);

  return parseFloat(bmi.toFixed(2));
};

export const calculateBmiNeedlePosition = (bmi: number) => {
  if (bmi < 18.5) return 0;
  else if (bmi >= 18.5 && bmi <= 24.9) return 1;
  else if (bmi >= 25 && bmi <= 29.9) return 2;
  else if (bmi >= 30 && bmi <= 39.9) return 3;
  else if (bmi >= 40) return 4;
};
