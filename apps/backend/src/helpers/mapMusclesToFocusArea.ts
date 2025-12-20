const muscleToFocusAreaMap = {
  Trapezius: "back",
  Back: "back",
  Shoulders: "shoulders",
  Chest: "chest",
  Biceps: "arms",
  Triceps: "arms",
  Forearms: "arms",
  Abdominals: "stomach",
  Obliques: "stomach",
  Glutes: "legs",
  Quadriceps: "legs",
  Hamstrings: "legs",
  Abductors: "legs",
  Adductors: "legs",
  Calves: "legs",
};

export const mapMusclesToFocusArea = (muscleNames: string[]) => {
  const mappedFocusAreas = [...new Set(muscleNames.map((name) => muscleToFocusAreaMap[name as keyof typeof muscleToFocusAreaMap]).filter(Boolean))];

  if (mappedFocusAreas.length > 3) return ["fullBody"];
  return mappedFocusAreas;
};
