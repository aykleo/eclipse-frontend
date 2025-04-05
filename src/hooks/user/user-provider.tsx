import { useState, ReactNode, useEffect } from "react";
import { User } from "../../utils/types/user-types";
import { UserContext } from "./use-context";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../api/user/fetch-user";
import { useNavigate } from "react-router-dom";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const navigate = useNavigate();

  function doesCookieExist(cookieName: string): boolean {
    const cookies = document.cookie.split("; ");
    return cookies.some((cookie) => {
      const [name] = cookie.split("=");
      return name === cookieName;
    });
  }

  const shouldFetchUser = doesCookieExist("loggedIn");

  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    enabled: shouldFetchUser,
  });

  useEffect(() => {
    if (error) {
      navigate("/");
      return;
    }
    if (data) {
      setUser(data);
    }
  }, [data, error, navigate]);

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, error }}>
      {children}
    </UserContext.Provider>
  );
}
