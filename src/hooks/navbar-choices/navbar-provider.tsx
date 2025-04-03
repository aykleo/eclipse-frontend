import { useState, ReactNode, useEffect } from "react";
import { NavBarChoices, NavBarContext } from "./navbar-context";
import { useSearchParams } from "react-router-dom";

export function NavBarProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialChoice =
    (searchParams.get("tab") as NavBarChoices) || "exercises";

  const [navbarChoices, setNavBarChoices] =
    useState<NavBarChoices>(initialChoice);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("tab", navbarChoices);
        return newParams;
      },
      { replace: true }
    );
  }, [navbarChoices, setSearchParams]);

  return (
    <NavBarContext.Provider value={{ navbarChoices, setNavBarChoices }}>
      {children}
    </NavBarContext.Provider>
  );
}
