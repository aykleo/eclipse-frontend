import { createContext, useContext } from "react";
import { UserContextType } from "../../utils/types/user-types";

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    console.log("useUser must be used within a UserProvider");
  }
  return context;
}
