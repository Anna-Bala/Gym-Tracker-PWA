import { RadioGroup } from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepFitnessLevelSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { fitnessLevelOptions } from "./constants";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepFitnessLevelFormData = z.infer<typeof OnboardingStepFitnessLevelSchema>;

const OnboardingStepFitnessLevel = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepFitnessLevelFormData>({
    defaultValues: {
      fitnessLevel: undefined,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepFitnessLevelSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepFitnessLevelFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/9");
  };

  return (
    <OnboardingStepWrapper
      title="How Many Push-Ups Can You Do?"
      description="Help us measure your fitness level by telling us how many push-ups you can do at one time."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="fitnessLevel"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup className="flex flex-col gap-4" onValueChange={field.onChange} value={field.value}>
                {fitnessLevelOptions.map((option) => (
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

export default OnboardingStepFitnessLevel;
