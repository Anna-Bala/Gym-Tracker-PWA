import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, OnboardingStepDaysSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui";
import { daysOptions } from "./constants";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollPicker } from "@/components/ScrollPicker";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

type OnboardingStepDaysFormData = z.infer<typeof OnboardingStepDaysSchema>;

const OnboardingStepDays = () => {
  const form = useForm<OnboardingStepDaysFormData>({
    defaultValues: {
      days: 1,
    },
    resolver: zodResolver(OnboardingStepDaysSchema),
  });

  const { handleSubmit } = form;
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepDaysFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    navigate("/onboarding/loading");
  };

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Select Your Weekly
        <br />
        Workout Plan
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        How often do you plan to work out each week? We'll create a schedule for you.
      </Typography>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ScrollPicker
                      className="!w-3/4"
                      infinite
                      initialValue={field.value.toString()}
                      onChange={field.onChange}
                      optionItemHeight={60}
                      options={daysOptions}
                      suffix="days"
                      visibleCount={30}
                    />
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

export default OnboardingStepDays;
