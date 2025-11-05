import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepHeightSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { heightOptions } from "./constants";
import { OnboardingStepWrapper } from ".";
import { ScrollPicker } from "@/components/ScrollPicker";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepHeightFormData = z.infer<typeof OnboardingStepHeightSchema>;

const OnboardingStepHeight = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepHeightFormData>({
    defaultValues: {
      height: 160,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepHeightSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepHeightFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/5");
  };

  return (
    <OnboardingStepWrapper title="Enter Your Height" description="Please provide your height in centimeters." form={form} handleFormSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ScrollPicker className="!w-3/4" infinite initialValue={field.value.toString()} onChange={field.onChange} optionItemHeight={60} options={heightOptions} suffix="cm" visibleCount={30} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </OnboardingStepWrapper>
  );
};

export default OnboardingStepHeight;
