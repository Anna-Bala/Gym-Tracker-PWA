import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@gym-tracker-pwa/schemas";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Loader } from "@/components/Loader";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleRefreshUserError = () => {
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_ENDPOINT_PREFIX}/user`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        handleRefreshUserError();
      } else {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      handleRefreshUserError();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      <>
        <Loader variant="full-screen" isLoading={isLoading} color="white" />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
