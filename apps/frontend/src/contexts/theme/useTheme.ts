import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./ThemeProvider";

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeProvider has not been initialized properly");
  return context;
};
