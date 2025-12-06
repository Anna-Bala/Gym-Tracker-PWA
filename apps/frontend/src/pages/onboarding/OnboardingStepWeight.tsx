import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepWeightSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";
import { WeightSelector } from "@/components/WeightSelector";

type OnboardingStepWeightFormData = z.infer<typeof OnboardingStepWeightSchema>;

const OnboardingStepWeight = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepWeightFormData>({
    defaultValues: {
      weight: 70,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepWeightSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepWeightFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/6");
  };

  return (
    <OnboardingStepWrapper title="Enter Your Weight" description="Please provide your weight in kilograms." form={form} handleFormSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <WeightSelector className="!w-3/4" initialValue={field.value.toString()} onChange={field.onChange} visibleCount={30} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepWeight;
