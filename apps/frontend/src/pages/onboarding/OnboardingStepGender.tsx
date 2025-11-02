import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepGenderSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";

import { Button } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { genderOptions } from "./constants";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepGenderFormData = z.infer<typeof OnboardingStepGenderSchema>;

const OnboardingStepGender = () => {
  const form = useForm<OnboardingStepGenderFormData>({
    defaultValues: {
      gender: undefined,
    },
    resolver: zodResolver(OnboardingStepGenderSchema),
  });

  const { handleSubmit } = form;
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepGenderFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    navigate("/onboarding/2");
  };

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Select Your Gender
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        Help us understand you better.
      </Typography>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup className="flex flex-row gap-4" onChange={field.onChange}>
                      {genderOptions.map((option) => (
                        <RadioGroupCardItem key={option.value} className="flex-col" {...option} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl gap-4 z-20">
            <Button className="flex-grow" variant="secondary">
              Skip
            </Button>
            <Button className="flex-grow" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default OnboardingStepGender;
