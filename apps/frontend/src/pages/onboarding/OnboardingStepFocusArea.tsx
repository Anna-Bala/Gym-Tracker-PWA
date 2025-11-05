import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepFocusAreaSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { CheckboxCardItem } from "@/components/CheckboxCardItem";
import { focusAreaOptions } from "./constants";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepFocusAreaFormData = z.infer<typeof OnboardingStepFocusAreaSchema>;

const OnboardingStepFocusArea = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepFocusAreaFormData>({
    defaultValues: {
      focusArea: undefined,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepFocusAreaSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepFocusAreaFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/3");
  };

  return (
    <OnboardingStepWrapper
      title="Choose Your Focus Area"
      description="Tell us which part of your body you'd like to focus on during your workouts."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="focusArea"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex flex-col gap-4">
                {focusAreaOptions.map((option) => (
                  <CheckboxCardItem
                    key={option.value}
                    onCheckedChange={(checked) => {
                      const newValue = checked ? [...(field.value || []), option.value] : field.value.filter((value) => value !== option.value);
                      field.onChange(newValue);
                    }}
                    checked={field.value?.includes(option.value as OnboardingStepFocusAreaFormData["focusArea"][number])}
                    {...option}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepFocusArea;
