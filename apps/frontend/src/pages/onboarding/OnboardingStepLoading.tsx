import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";
import Warning from "@icons/warning.svg?react";

const OnboardingStepLoading = () => {
  const [isError, setIsError] = useState(false);
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  const handleUserOnboardingCreation = async () => {
    try {
      setIsError(false);

      const response = await authFetch("/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (responseData.errors || responseData.errorCode) throw new Error();
      else navigate("/home");
    } catch {
      setIsError(true);
    }
  };

  useEffect(() => {
    handleUserOnboardingCreation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ResponsivePageShell contentClassName="w-full xl:max-w-[760px] xl:mx-auto" title={isError ? "Failed to initialize your profile" : "We are setting up your profile"}>
      {!isError ? (
        <div className="w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card to-muted/25 shadow-wide-xs px-6 py-8 flex flex-col gap-5">
          <Loader variant="inline" isLoading={true} color="primary" size="lg" />
          <Typography className="font-medium text-center text-foreground" variant="md-24">
            Please wait...
          </Typography>
          <Typography className="font-light text-center text-muted-foreground" variant="md-24">
            This will just take a moment. Get ready to transform your fitness journey!
          </Typography>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card to-muted/25 shadow-wide-xs px-6 py-8 flex flex-col items-center gap-4">
          <Warning className="w-24 h-24" />
          <Typography className="text-center text-muted-foreground" variant="md-24">
            We're having trouble getting your profile ready. Please tap Retry to continue. If you're still having trouble, check your connection and try again in a moment.
          </Typography>

          <div className="flex flex-col w-full gap-4 mt-8">
            <Button className="flex-grow" variant="default" onClick={handleUserOnboardingCreation}>
              Retry
            </Button>
          </div>
        </div>
      )}
    </ResponsivePageShell>
  );
};

export default OnboardingStepLoading;
