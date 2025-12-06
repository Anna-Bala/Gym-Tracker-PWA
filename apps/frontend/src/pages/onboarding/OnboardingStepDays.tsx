import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepDaysSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { daysOptions } from "./constants";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { ScrollPicker } from "@/components/ScrollPicker";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepDaysFormData = z.infer<typeof OnboardingStepDaysSchema>;

const OnboardingStepDays = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepDaysFormData>({
    defaultValues: {
      days: 1,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepDaysSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepDaysFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/loading");
  };

  return (
    <OnboardingStepWrapper
      title="Select Your Weekly Workout Plan"
      description="How often do you plan to work out each week? We'll create a schedule for you."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="days"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ScrollPicker className="!w-3/4" infinite initialValue={field.value.toString()} onChange={field.onChange} optionItemHeight={60} options={daysOptions} suffix="days" visibleCount={25} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepDays;
