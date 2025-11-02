import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepFocusAreaSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui";
import { CheckboxCardItem } from "@/components/CheckboxCardItem";
import { focusAreaOptions } from "./constants";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepFocusAreaFormData = z.infer<typeof OnboardingStepFocusAreaSchema>;

const OnboardingStepFocusArea = () => {
  const form = useForm<OnboardingStepFocusAreaFormData>({
    defaultValues: {
      focusArea: undefined,
    },
    resolver: zodResolver(OnboardingStepFocusAreaSchema),
  });

  const { handleSubmit } = form;
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepFocusAreaFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    navigate("/onboarding/3");
  };

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Choose Your Focus Area
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        Tell us which part of your body you'd like to focus on during your workouts.
      </Typography>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
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
                          {...option}
                        />
                      ))}
                    </div>
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

export default OnboardingStepFocusArea;
