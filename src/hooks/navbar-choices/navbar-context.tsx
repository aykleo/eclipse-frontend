import { createContext, useContext } from "react";

export type NavBarChoices = "exercises" | "workouts" | "statistics";

interface NavBarContextType {
  navbarChoices: NavBarChoices;
  setNavBarChoices: React.Dispatch<React.SetStateAction<NavBarChoices>>;
}

export const NavBarContext = createContext<NavBarContextType>({
  navbarChoices: "exercises",
  setNavBarChoices: () => {},
});

export function useNavBar() {
  const context = useContext(NavBarContext);
  if (context === undefined) {
    console.log("useNavBar must be used within a NavBarProvider");
  }
  return context;
}
