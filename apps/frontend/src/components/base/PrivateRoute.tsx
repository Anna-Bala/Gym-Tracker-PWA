import { Navigate, Outlet, useLocation } from "react-router-dom";

import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/auth/useAuth";

const PrivateRoute = () => {
  const { accessToken, isLoading } = useAuth();

  const { pathname } = useLocation();
  const isOnboarding = pathname.includes("onboarding");

  return accessToken || isLoading ? (
    <BottomNavigation isHidden={isOnboarding}>
      <Outlet />
    </BottomNavigation>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
