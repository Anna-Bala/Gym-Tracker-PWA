import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Loader } from "@/components/Loader";

export interface AuthContextValue {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      const response = await fetch(`${API_ENDPOINT_PREFIX}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        setAccessToken(responseData.token);
        setIsLoading(false);
      } else {
        throw new Error();
      }
    };

    const handleRefreshTokenRequest = async () => {
      setIsLoading(true);
      try {
        await refreshAccessToken();
      } catch {
        navigate("/login");
        setIsLoading(false);
      }
    };

    handleRefreshTokenRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading }}>
      <>
        <Loader variant="full-screen" isLoading={isLoading} color="white" />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
