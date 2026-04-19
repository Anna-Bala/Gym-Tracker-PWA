import type { Exercise } from "@gym-tracker-pwa/schemas";

export const exerciseApiItem: Exercise = {
  id: "ex-1",
  code: "PLANK",
  name: "Plank",
  description: "Core stabilization hold",
  image: "data:image/png;base64,AAAA",
  primaryMuscles: [{ id: "m-1", code: "abs", name: "Abs" }],
  secondaryMuscles: [],
  types: [{ id: "t-1", code: "isolation", name: "Isolation" }],
  categories: [{ id: "c-1", code: "body_weight", name: "Body weight" }],
};
