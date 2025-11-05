import { createContext, type ReactNode, useState } from "react";

export interface OnboardingFormValue {
  addNewValue: (key: string, value: string | string[] | number) => void;
  formData: object;
}

const OnboardingFormContext = createContext<OnboardingFormValue | null>(null);

interface OnboardingFormProviderProps {
  children: ReactNode;
}

const OnboardingFormProvider = ({ children }: OnboardingFormProviderProps) => {
  const [formData, setFormData] = useState<{ [key: string]: string | string[] | number }>({});

  const addNewValue = (key: string, value: string | string[] | number) => (Object.keys(formData).includes(key) ? (formData[key] = value) : setFormData((formData) => ({ ...formData, [key]: value })));

  return <OnboardingFormContext.Provider value={{ addNewValue, formData }}>{children}</OnboardingFormContext.Provider>;
};

export { OnboardingFormContext, OnboardingFormProvider };
