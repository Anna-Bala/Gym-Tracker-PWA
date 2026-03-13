import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { Form } from "@/components/ui/form";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
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

  const {
    formState: { isValid },
  } = form;

  return (
    <ResponsivePageShell contentClassName="w-full xl:max-w-[760px] xl:mx-auto" title={title} hideMobileBackButton>
      <Form {...form}>
        <form className="w-full xl:rounded-2xl xl:border xl:border-border/80 xl:bg-gradient-to-b xl:from-card xl:to-muted/20 xl:p-6 xl:shadow-wide-xs" onSubmit={handleFormSubmit} noValidate>
          <Typography className="mb-6 text-center text-muted-foreground xl:text-left" variant="md-24">
            {description}
          </Typography>
          <div className="w-full flex flex-col gap-4">{children}</div>
          <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background/95 border-t border-border shadow-wide-lg backdrop-blur gap-4 z-20 xl:static xl:px-0 xl:py-0 xl:mt-6 xl:border-none xl:shadow-none xl:backdrop-blur-none">
            {!disableBackButton ? (
              <Button className="flex-grow" variant="secondary" type="button" onClick={navigateToPreviousScreen}>
                Back
              </Button>
            ) : null}
            <Button className="flex-grow" disabled={!isValid} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </ResponsivePageShell>
  );
};

export default OnboardingStepWrapper;
