import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux-store/slices/authSlice";
import type { UserRole } from "@/types/editor.types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute = ({
  children,
  requiresAuth = false,
  allowedRoles,
  fallbackPath = "/admin/login",
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector(selectAuth);

  // No protection requested
  if (!requiresAuth && (!allowedRoles || allowedRoles.length === 0)) {
    return <>{children}</>;
  }

  // Auth state not yet resolved (redux-persist rehydration). Don't redirect.
  if (loading || (isAuthenticated && user === null)) {
    return null; // swap for <LoadingSpinner /> if preferred
  }

  // Authentication gate
  if (requiresAuth && !isAuthenticated) {
    return (
      <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />
    );
  }

  // Role gate
  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) {
      // Authenticated but wrong role -> neutral page, never back to login
      return <Navigate to='/' replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
