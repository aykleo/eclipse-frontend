import { useState, ReactNode, useEffect } from "react";
import { User } from "../../utils/types/user-types";
import { UserContext } from "./use-context";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../api/user/fetch-user";
import { useNavigate } from "react-router-dom";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  // const storedUser = localStorage.getItem("user");
  // if (storedUser) {
  //   const { value, expiry } = JSON.parse(storedUser);
  //   if (new Date().getTime() > expiry) {
  //     localStorage.removeItem("user");
  //     return null;
  //   }
  //   return value;
  // }
  // return null;
  // });

  // const clearUser = async () => {
  //   localStorage.removeItem("user");
  //   setUser(null);
  // };

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   if (user) {
  //     const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days
  //     localStorage.setItem("user", JSON.stringify({ value: user, expiry }));
  //   }
  // }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, error }}>
      {children}
    </UserContext.Provider>
  );
}
