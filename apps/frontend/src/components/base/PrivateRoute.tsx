import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/auth/useAuth";

const PrivateRoute = () => {
  const { accessToken, isLoading } = useAuth();

  return accessToken || isLoading ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
