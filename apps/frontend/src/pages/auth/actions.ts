"use server";

import { API_ENDPOINT_PREFIX } from "@/secrets";

export interface LoginActionState {
  accessToken: string | null;
  success: boolean | null;
  onboardingFilled?: boolean;
}

export interface RegistrationActionState {
  success: boolean | null;
}

export const handleLoginAction = async (_prevState: LoginActionState, data: FormData): Promise<LoginActionState> => {
  try {
    const formData = Object.fromEntries(data);
    const response = await fetch(`${API_ENDPOINT_PREFIX}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) return { accessToken: null, success: false };

    const responseData = await response.json();

    return { accessToken: responseData.token, success: true, onboardingFilled: responseData.onboardingFilled };
  } catch {
    return { accessToken: null, success: false };
  }
};

export const handleRegistrationAction = async (_prevState: RegistrationActionState, data: FormData): Promise<RegistrationActionState> => {
  try {
    const formData = Object.fromEntries(data);
    const response = await fetch(`${API_ENDPOINT_PREFIX}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) return { success: false };

    return { success: true };
  } catch {
    return { success: false };
  }
};
