import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepRestTimeSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { OnboardingStepWrapper } from ".";
import { restTimeOptions } from "./constants";
import { ScrollPicker } from "@/components/ScrollPicker";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepRestTimeFormData = z.infer<typeof OnboardingStepRestTimeSchema>;

const OnboardingStepRestTime = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepRestTimeFormData>({
    defaultValues: {
      restTime: 60,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepRestTimeSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepRestTimeFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/loading");
  };

  return (
    <OnboardingStepWrapper
      title="Rest Between Sets"
      description="How much recovery time do you need between each set? Most people rest for 60-90 seconds."
      form={form}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="restTime"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ScrollPicker
                className="!w-3/4"
                infinite
                initialValue={field.value.toString()}
                onChange={field.onChange}
                optionItemHeight={60}
                options={restTimeOptions}
                suffix="sec"
                visibleCount={25}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepRestTime;
