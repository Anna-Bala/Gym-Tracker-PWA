import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Button } from "@/components/ui";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";
import Warning from "@icons/warning.svg?react";

const OnboardingStepLoading = () => {
  const [isError, setIsError] = useState(false);
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleUserOnboardingCreation = async () => {
    try {
      setIsError(false);

      const response = await fetch(`${API_ENDPOINT_PREFIX}/onboarding`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
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
    if (!accessToken) return;
    handleUserOnboardingCreation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const navigateToHomeScreen = () => navigate("/home");

  return (
    <section className="flex flex-col items-center justify-between h-[90vh]">
      {!isError ? (
        <>
          <div className="flex flex-col gap-4">
            <Typography className="font-bold w-full text-center" variant="h2">
              Creating Personalized Workout Plan For You
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
              Failed to Create
              <br />
              Workout Plan
            </Typography>
            <Typography className="mt-2 font-light text-center" variant="md-24">
              It looks like something went wrong. You can tap Retry to try again, or Skip to head to the home screen. Don't worry - you can always create your workout plan later from your profile.
            </Typography>

            <div className="flex flex-col w-full gap-4 mt-8">
              <Button className="flex-grow" variant="secondary" onClick={handleUserOnboardingCreation}>
                Retry
              </Button>
              <Button className="flex-grow" onClick={navigateToHomeScreen}>
                Skip
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default OnboardingStepLoading;
