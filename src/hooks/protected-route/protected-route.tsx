import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user/use-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user === null) {
      navigate("/", { replace: true });
    }
    if (user === undefined) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return <>{children}</>;
};
