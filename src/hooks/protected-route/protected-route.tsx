import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user/use-context";
import { SmallLoadingGif } from "../../components/small-loading-gif";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const hasLoggedInCookie = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("loggedIn="));

    if (user === null || !hasLoggedInCookie) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (user === undefined) {
    return <SmallLoadingGif />;
  }

  return <>{children}</>;
};
