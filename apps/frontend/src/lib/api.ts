import { authFetch } from "@/lib/fetchClient";

export const changeUserTheme = async (theme: "dark" | "light") => {
  await authFetch("/user/theme", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ theme }),
  });
};
