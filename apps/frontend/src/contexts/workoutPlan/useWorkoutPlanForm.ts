import { useContext } from "react";

import { WorkoutPlanFormContext, type WorkoutPlanFormValue } from "./WorkoutPlanFormProvider";

export const useWorkoutPlanForm = (): WorkoutPlanFormValue => {
  const context = useContext(WorkoutPlanFormContext);
  if (!context) throw new Error("WorkoutPlanFormProvider has not been initialized properly");
  return context;
};
