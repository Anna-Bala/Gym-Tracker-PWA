import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { Loader } from "@/components/Loader";
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
    <section className="flex flex-col items-center justify-between h-[90vh]">
      {!isError ? (
        <>
          <div className="flex flex-col gap-4">
            <Typography className="font-bold w-full text-center" variant="h2">
              We are setting up your profile
            </Typography>
            <Typography className="mt-2 font-light text-center" variant="md-24">
              Please Wait...
            </Typography>
          </div>
          <Loader variant="inline" isLoading={true} color="primary" size="lg" />
          <Typography className="mt-2 font-light text-center" variant="md-24">
            This will just take a moment. Get ready to transform your fitness journey!
          </Typography>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 h-[90vh]">
            <Warning className="w-24 h-24" />

            <Typography className="font-bold w-full text-center" variant="h2">
              Failed to initialize
              <br />
              Your profile
            </Typography>
            <Typography className="mt-2 font-light text-center" variant="md-24">
              We're having trouble getting your profile ready. Please tap Retry to continue. If you're still having trouble, please check your connection and try again in a moment.
            </Typography>

            <div className="flex flex-col w-full gap-4 mt-8">
              <Button className="flex-grow" variant="default" onClick={handleUserOnboardingCreation}>
                Retry
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default OnboardingStepLoading;
