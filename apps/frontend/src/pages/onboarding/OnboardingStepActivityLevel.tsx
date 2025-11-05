import { RadioGroup } from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepActivityLevelSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { activityLevelOptions } from "./constants";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepActivityLevelFormData = z.infer<typeof OnboardingStepActivityLevelSchema>;

const OnboardingStepActivityLevel = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepActivityLevelFormData>({
    defaultValues: {
      activityLevel: undefined,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepActivityLevelSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepActivityLevelFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/7");
  };

  return (
    <OnboardingStepWrapper
      title="Select Your Activity Level"
      description="Tell us about your daily activity level to tailor your workouts accordingly."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup className="flex flex-col gap-4" onValueChange={field.onChange} value={field.value}>
                {activityLevelOptions.map((option) => (
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

export default OnboardingStepActivityLevel;
