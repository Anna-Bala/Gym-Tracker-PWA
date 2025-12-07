import { authFetch } from "@/lib/fetchClient";

export interface ChangePasswordActionState {
  success: boolean | null;
}

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
