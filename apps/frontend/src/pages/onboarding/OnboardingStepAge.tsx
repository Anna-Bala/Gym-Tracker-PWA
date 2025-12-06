import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepAgeSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { AgeSelector } from "@/components/AgeSelector";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepAgeFormData = z.infer<typeof OnboardingStepAgeSchema>;

const OnboardingStepAge = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepAgeFormData>({
    defaultValues: {
      age: 25,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepAgeSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepAgeFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/4");
  };

  return (
    <OnboardingStepWrapper title="Enter Your Age" description="Your age helps us design suitable workouts." form={form} handleFormSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AgeSelector className="!w-3/4" initialValue={field.value.toString()} onChange={field.onChange} visibleCount={30} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepAge;
