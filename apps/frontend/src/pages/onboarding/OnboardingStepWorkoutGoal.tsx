import { RadioGroup } from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepWorkoutGoalSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";
import { workoutGoalOptions } from "./constants";

type OnboardingStepWorkoutGoalFormData = z.infer<typeof OnboardingStepWorkoutGoalSchema>;

const OnboardingStepWorkoutGoal = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepWorkoutGoalFormData>({
    defaultValues: {
      workoutGoal: undefined,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepWorkoutGoalSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepWorkoutGoalFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/8");
  };

  return (
    <OnboardingStepWrapper
      title="Set Your Workout Goal"
      description="What's your primary fitness goal? We'll create a plan to help you achieve it."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="workoutGoal"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup className="flex flex-col gap-4" onValueChange={field.onChange} value={field.value}>
                {workoutGoalOptions.map((option) => (
                  <RadioGroupCardItem key={option.value} {...option} />
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepWorkoutGoal;
