import { createContext, useEffect, type ReactNode } from "react";
import { useForm, useFieldArray, type UseFormReturn, type UseFieldArrayAppend, type FieldArrayWithId, type UseFieldArrayRemove } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z, FormWorkoutPlanSchema, type Exercise } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type WorkoutPlanFormData = z.infer<typeof FormWorkoutPlanSchema>;

export interface WorkoutPlanFormValue {
  appendExercise: UseFieldArrayAppend<WorkoutPlanFormData>;
  exercisesFields: FieldArrayWithId<WorkoutPlanFormData, "exercises", "id">[];
  form: UseFormReturn<WorkoutPlanFormData>;
  isEdit: boolean;
  removeExercise: UseFieldArrayRemove;
}

const WorkoutPlanFormContext = createContext<WorkoutPlanFormValue | null>(null);

interface WorkoutPlanFormProviderProps {
  children: ReactNode;
}

const WorkoutPlanFormProvider = ({ children }: WorkoutPlanFormProviderProps) => {
  const location = useLocation();

  const emptyFormValues = {
    name: "",
    description: "",
    exercises: [],
    primaryMuscles: undefined,
    days: [],
  };

  const form = useForm<WorkoutPlanFormData>({
    defaultValues: emptyFormValues,
    resolver: zodResolver(FormWorkoutPlanSchema),
  });

  useEffect(() => {
    const primaryMuscles = location.state
      ? [...new Set(location.state.exercises.flatMap((exercise: Exercise) => exercise?.primaryMuscles?.map(({ name }: { name: string }) => name) || []))]
      : undefined;

    form.reset({
      ...emptyFormValues,
      ...location.state,
      primaryMuscles,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const isEdit = location.pathname.includes("/edit");

  const { append: appendExercise, fields: exercisesFields, remove: removeExercise } = useFieldArray({ control: form.control, name: "exercises" });

  return <WorkoutPlanFormContext.Provider value={{ appendExercise, exercisesFields, form, isEdit, removeExercise }}>{children}</WorkoutPlanFormContext.Provider>;
};

export { WorkoutPlanFormContext, WorkoutPlanFormProvider };
