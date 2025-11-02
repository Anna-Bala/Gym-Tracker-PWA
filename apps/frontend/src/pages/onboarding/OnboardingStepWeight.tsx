import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, OnboardingStepWeightSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollPicker } from "@/components/ScrollPicker";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";
import { weightOptions } from "./constants";

type OnboardingStepWeightFormData = z.infer<typeof OnboardingStepWeightSchema>;

const OnboardingStepWeight = () => {
  const form = useForm<OnboardingStepWeightFormData>({
    defaultValues: {
      weight: 70,
    },
    resolver: zodResolver(OnboardingStepWeightSchema),
  });

  const { handleSubmit } = form;
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const onSubmit = (data: OnboardingStepWeightFormData) => {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    navigate("/onboarding/6");
  };

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Enter Your Weight
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        Please provide your weight in kilograms.
      </Typography>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ScrollPicker
                      className="!w-3/4"
                      infinite
                      initialValue={field.value.toString()}
                      onChange={field.onChange}
                      optionItemHeight={60}
                      options={weightOptions}
                      suffix="kg"
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

export default OnboardingStepWeight;
