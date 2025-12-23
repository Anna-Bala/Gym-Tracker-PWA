import { createContext, type ReactNode } from "react";
import { useForm, useFieldArray, type UseFormReturn, type UseFieldArrayAppend, type FieldArrayWithId, type UseFieldArrayRemove } from "react-hook-form";
import { z, FormWorkoutPlanSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type WorkoutPlanFormData = z.infer<typeof FormWorkoutPlanSchema>;

export interface WorkoutPlanFormValue {
  appendExercise: UseFieldArrayAppend<WorkoutPlanFormData>;
  exercisesFields: FieldArrayWithId<WorkoutPlanFormData, "exercises", "id">[];
  form: UseFormReturn<WorkoutPlanFormData>;
  removeExercise: UseFieldArrayRemove;
}

const WorkoutPlanFormContext = createContext<WorkoutPlanFormValue | null>(null);

interface WorkoutPlanFormProviderProps {
  children: ReactNode;
}

const WorkoutPlanFormProvider = ({ children }: WorkoutPlanFormProviderProps) => {
  const form = useForm<WorkoutPlanFormData>({
    defaultValues: {
      name: "",
      description: "",
      exercises: [],
      primaryMuscles: undefined,
      days: [],
    },
    resolver: zodResolver(FormWorkoutPlanSchema),
  });

  const { append: appendExercise, fields: exercisesFields, remove: removeExercise } = useFieldArray({ control: form.control, name: "exercises" });

  return <WorkoutPlanFormContext.Provider value={{ appendExercise, exercisesFields, form, removeExercise }}>{children}</WorkoutPlanFormContext.Provider>;
};

export { WorkoutPlanFormContext, WorkoutPlanFormProvider };
