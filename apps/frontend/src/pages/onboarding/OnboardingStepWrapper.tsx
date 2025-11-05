import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { Form } from "@/components/ui/form";
import { Typography } from "@/components/base/Typography";

interface OnboardingStepWrapperProps {
  children: ReactNode;
  description: string;
  disableBackButton?: boolean;
  handleFormSubmit: React.FormEventHandler<HTMLFormElement>;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

const OnboardingStepWrapper = ({ children, disableBackButton, description, form, handleFormSubmit, title }: OnboardingStepWrapperProps) => {
  const navigate = useNavigate();
  const navigateToPreviousScreen = () => navigate(-1);

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        {title}
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        {description}
      </Typography>
      <Form {...form}>
        <form onSubmit={handleFormSubmit} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">{children}</div>
          <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl gap-4 z-20">
            {!disableBackButton && (
              <Button className="flex-grow" variant="secondary" onClick={navigateToPreviousScreen}>
                Back
              </Button>
            )}
            <Button className="flex-grow" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default OnboardingStepWrapper;
