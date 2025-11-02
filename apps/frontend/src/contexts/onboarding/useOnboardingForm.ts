import { useContext } from "react";

import { OnboardingFormContext, type OnboardingFormValue } from "./OnboardingFormProvider";

export const useOnboardingForm = (): OnboardingFormValue => {
  const context = useContext(OnboardingFormContext);
  if (!context) throw new Error("OnboardingFormProvider has not been initialized properly");
  return context;
};
