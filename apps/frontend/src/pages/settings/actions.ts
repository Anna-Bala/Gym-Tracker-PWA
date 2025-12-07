import { authFetch } from "@/lib/fetchClient";

interface HandleProfileSettingSaveState {
  success: boolean | null;
}

interface ChangePasswordActionState {
  success: boolean | null;
}

export const handleProfileSettingSave = async (_prevState: HandleProfileSettingSaveState, data: FormData): Promise<HandleProfileSettingSaveState> => {
  try {
    const formData = Object.fromEntries(data);
    const response = await authFetch("/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) return { success: false };

    return { success: true };
  } catch {
    return { success: false };
  }
};

export const handleChangePasswordAction = async (_prevState: ChangePasswordActionState, data: FormData): Promise<ChangePasswordActionState> => {
  try {
    const formData = Object.fromEntries(data);
    const response = await authFetch("/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) return { success: false };

    return { success: true };
  } catch {
    return { success: false };
  }
};
