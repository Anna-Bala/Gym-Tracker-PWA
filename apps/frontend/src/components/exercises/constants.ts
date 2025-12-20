const musclesOptions = [
  {
    description: "Abductors",
    value: "abductors" as const,
  },
  {
    description: "Abs",
    value: "abs" as const,
  },
  {
    description: "Adductors",
    value: "adductors" as const,
  },
  {
    description: "Back",
    value: "back" as const,
  },
  {
    description: "Biceps",
    value: "biceps" as const,
  },
  {
    description: "Calves",
    value: "calves" as const,
  },
  {
    description: "Chest",
    value: "chest" as const,
  },
  {
    description: "Forearms",
    value: "forearms" as const,
  },
  {
    description: "Glutes",
    value: "glutes" as const,
  },
  {
    description: "Hamstrings",
    value: "hamstrings" as const,
  },
  {
    description: "Obliques",
    value: "obliques" as const,
  },
  {
    description: "Quadriceps",
    value: "quadriceps" as const,
  },
  {
    description: "Shoulders",
    value: "shoulders" as const,
  },
  {
    description: "Trapezius",
    value: "trapezius" as const,
  },
  {
    description: "Triceps",
    value: "triceps" as const,
  },
];

const categoriesOptions = [
  {
    description: "Body weight",
    value: "body_weight" as const,
  },
  {
    description: "Cable",
    value: "cable" as const,
  },
  {
    description: "Free weight",
    value: "free_weight" as const,
  },
  {
    description: "Machine",
    value: "machine" as const,
  },
];

const typesOptions = [
  {
    description: "Isolation",
    value: "isolation" as const,
  },
  {
    description: "Polyarticular",
    value: "polyarticular" as const,
  },
];

export const discoverExercisesFilterFields = [
  {
    title: "Muscles",
    name: "muscles" as const,
    options: musclesOptions,
  },
  {
    title: "Equipment Type",
    name: "categories" as const,
    options: categoriesOptions,
  },
  {
    title: "Movement Type",
    name: "types" as const,
    options: typesOptions,
  },
];
