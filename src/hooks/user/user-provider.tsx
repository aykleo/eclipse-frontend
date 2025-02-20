import { useState, ReactNode } from "react";
import { User } from "../../utils/types/user-types";
import { UserContext } from "./use-context";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const { value, expiry } = JSON.parse(storedUser);
  //     if (new Date().getTime() > expiry) {
  //       localStorage.removeItem("user");
  //       return null;
  //     }
  //     return value;
  //   }
  //   return null;
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
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
