import { createContext, useEffect, useState, type ReactNode } from "react";

import { changeUserTheme } from "@/lib/api";
import { useAuth } from "../auth/useAuth";
import type { User } from "@gym-tracker-pwa/schemas";

export interface ThemeContextValue {
  theme: User["theme"];
  setTheme: React.Dispatch<React.SetStateAction<User["theme"]>>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<User["theme"]>("light");

  const { user } = useAuth();

  useEffect(() => {
    let userPreferesDarkTheme = false;

    if (user?.theme === null || user === null) {
      userPreferesDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const userTheme = userPreferesDarkTheme ? "dark" : "light";

      if (user?.id) changeUserTheme(userTheme);
    } else {
      userPreferesDarkTheme = user?.theme === "dark";
    }

    if (userPreferesDarkTheme) {
      setTheme("dark");
      document.body.classList.add("dark");
    } else {
      setTheme("light");
      document.body.classList.remove("dark");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
