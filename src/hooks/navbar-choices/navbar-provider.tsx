import { useState, ReactNode } from "react";
import { NavBarChoices, NavBarContext } from "./navbar-context";

export function NavBarProvider({ children }: { children: ReactNode }) {
  const [navbarChoices, setNavBarChoices] =
    useState<NavBarChoices>("exercises");

  return (
    <NavBarContext.Provider value={{ navbarChoices, setNavBarChoices }}>
      {children}
    </NavBarContext.Provider>
  );
}
