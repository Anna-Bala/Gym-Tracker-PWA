import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "./AuthProvider";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider has not been initialized properly");
  return context;
};
