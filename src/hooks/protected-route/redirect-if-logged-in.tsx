import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user/use-context";

interface RedirectIfLoggedInProps {
  children: ReactNode;
}

export const RedirectIfLoggedIn: React.FC<RedirectIfLoggedInProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/exercises", { replace: true });
    }
  }, [user, navigate]);

  return <>{children}</>;
};
