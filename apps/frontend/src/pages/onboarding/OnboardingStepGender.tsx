import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepGenderSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { genderOptions } from "./constants";
import { OnboardingStepWrapper } from ".";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepGenderFormData = z.infer<typeof OnboardingStepGenderSchema>;

const OnboardingStepGender = () => {
  const { addNewValue, formData } = useOnboardingForm();

  const form = useForm<OnboardingStepGenderFormData>({
    defaultValues: {
      gender: undefined,
      ...formData,
    },
    resolver: zodResolver(OnboardingStepGenderSchema),
  });

  const { handleSubmit } = form;

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepGenderFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      addNewValue(key, value);
    });

    navigate("/onboarding/2");
  };

  return (
    <OnboardingStepWrapper title="Select Your Gender" description="Help us understand you better." disableBackButton form={form} handleFormSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup className="flex flex-row gap-4" onValueChange={field.onChange} value={field.value}>
                {genderOptions.map((option) => (
                  <RadioGroupCardItem key={option.value} className="flex-col" {...option} />
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

export default OnboardingStepGender;
