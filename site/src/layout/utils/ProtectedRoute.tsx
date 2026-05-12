import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "../../auth/stores/auth-store";

export const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
