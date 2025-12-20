import { useState } from "react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { Button, Input } from "@/components/ui";
import { FormLabel } from "@/components/ui/form";
import { useWorkoutPlanForm } from "@/contexts/workoutPlan/useWorkoutPlanForm";
import Minus from "@icons/minus.svg?react";
import Plus from "@icons/plus.svg?react";

const PlusButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="default" size="icon" onClick={onClick}>
    <Plus className="text-white" />
  </Button>
);

const MinusButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
  <Button disabled={disabled} variant="default" size="icon" onClick={onClick}>
    <Minus className="text-white" />
  </Button>
);

interface ExercisesDetailsFooterProps {
  exerciseDetails: Exercise;
  closeExerciseDetailsPanel: () => void;
}

const ExercisesDetailsFooter = ({ closeExerciseDetailsPanel, exerciseDetails }: ExercisesDetailsFooterProps) => {
  const [sets, setSets] = useState("0");
  const [reps, setReps] = useState("0");

  const {
    appendExercise,
    form: { setValue, getValues },
  } = useWorkoutPlanForm();

  const addExercise = () => {
    appendExercise({
      exerciseApiId: exerciseDetails.id,
      sets: Number(sets),
      reps: Number(reps),
      name: exerciseDetails.name,
    });

    const newPrimaryMusclesValue = [...new Set([...(getValues()?.primaryMuscles || []), ...(exerciseDetails.primaryMuscles?.map(({ name }) => name) || [])])];

    setValue("primaryMuscles", newPrimaryMusclesValue);
    closeExerciseDetailsPanel();
  };

  const addOne = (value: string) => (Number(value) + 1).toString();
  const subtractOne = (value: string) => (Number(value) - 1).toString();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") return "";

    const numberValue = Math.max(0, Number(value));
    return numberValue.toString().replace("+", "").replace("-", "");
  };

  const handleInputOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col">
      <FormLabel className="text-lg">Exercise sets</FormLabel>
      <div className="flex items-center mt-2 gap-3">
        <MinusButton disabled={sets === "0"} onClick={() => setSets(subtractOne)} />
        <Input min={0} type="number" value={sets} onKeyDown={handleInputOnKeyDown} onChange={(event) => setSets(handleInputChange(event))} />
        <PlusButton onClick={() => setSets(addOne)} />
      </div>

      <FormLabel className="text-lg mt-4">Exercise reps</FormLabel>
      <div className="flex items-center mt-2 gap-3">
        <MinusButton disabled={reps === "0"} onClick={() => setReps(subtractOne)} />
        <Input min={0} type="number" value={reps} onKeyDown={handleInputOnKeyDown} onChange={(event) => setReps(handleInputChange(event))} />
        <PlusButton onClick={() => setReps(addOne)} />
      </div>

      <Button className="mt-6" disabled={sets === "0" || reps === "0"} onClick={addExercise}>
        Add
      </Button>
    </div>
  );
};

export default ExercisesDetailsFooter;
