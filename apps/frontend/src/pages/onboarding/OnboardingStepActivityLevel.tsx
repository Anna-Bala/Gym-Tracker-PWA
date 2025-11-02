import { RadioGroup } from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepActivityLevelSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { activityLevelOptions } from "./constants";
import { Button } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepActivityLevelFormData = z.infer<typeof OnboardingStepActivityLevelSchema>;

const OnboardingStepActivityLevel = () => {
  const form = useForm<OnboardingStepActivityLevelFormData>({
    defaultValues: {
      activityLevel: undefined,
    },
    resolver: zodResolver(OnboardingStepActivityLevelSchema),
  });

  const { handleSubmit } = form;
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepActivityLevelFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    navigate("/onboarding/7");
  };

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Select Your Activity Level
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        Tell us about your daily activity level to tailor your workouts accordingly.
      </Typography>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup className="flex flex-col gap-4" onChange={field.onChange}>
                      {activityLevelOptions.map((option) => (
                        <RadioGroupCardItem key={option.value} {...option} />
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

export default OnboardingStepActivityLevel;
