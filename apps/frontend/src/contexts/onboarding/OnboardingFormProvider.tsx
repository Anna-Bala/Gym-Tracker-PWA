import { createContext, type ReactNode } from "react";

export interface OnboardingFormValue {
  formData: FormData;
}

const OnboardingFormContext = createContext<OnboardingFormValue | null>(null);

interface OnboardingFormProviderProps {
  children: ReactNode;
}

const OnboardingFormProvider = ({ children }: OnboardingFormProviderProps) => {
  const formData = new FormData();

  return <OnboardingFormContext.Provider value={{ formData }}>{children}</OnboardingFormContext.Provider>;
};

export { OnboardingFormContext, OnboardingFormProvider };
