// src/components/auth/ProtectedRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { UserRole } from "@/types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.some((role) => user.roles.includes(role))
  ) {
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
};
