import { useNavigate } from "react-router-dom";

import { Typography } from "@/components/base/Typography";
import { useOnboardingForm } from "@/contexts/onboarding/useOnboardingForm";

const OnboardingStepLoading = () => {
  const { formData } = useOnboardingForm();

  const navigate = useNavigate();

  return (
    <section>
      <Typography className="font-bold w-full text-center" variant="h2">
        Creating Personalized Workout Plan For You
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        Please Wait...
      </Typography>
      <Typography className="mt-2 font-light text-center" variant="md-24">
        This will just take a moment. Get ready to transform your fitness journey!
      </Typography>
    </section>
  );
};

export default OnboardingStepLoading;
