import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/auth/useAuth";

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  const { pathname } = useLocation();
  const isOnboarding = pathname.includes("onboarding");

  return user || isLoading ? (
    <Navigation isHidden={isOnboarding}>
      <Outlet />
    </Navigation>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
