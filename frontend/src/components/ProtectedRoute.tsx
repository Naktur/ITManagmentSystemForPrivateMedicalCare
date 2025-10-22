import React from "react";
import { Navigate } from "react-router-dom";
import AccessDenied from "./AccessDenied";

interface ProtectedRouteProps {
  allowedRoles: string[];
  element: React.JSX.Element;
}

export default function ProtectedRoute({ allowedRoles, element }: ProtectedRouteProps) {
  const role = localStorage.getItem("userRole");

  // Brak roli → niezalogowany
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Rola nie ma dostępu → komunikat
  if (!allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  // Rola ma dostęp → pokaż stronę
  return element;
}
