import { useState, ReactNode } from "react";
import { StatusContext } from "./status-context";

export function StatusProvider({ children }: { children: ReactNode }) {
  const [statusText, setStatusText] = useState<string | null>(null);

  return (
    <StatusContext.Provider value={{ statusText, setStatusText }}>
      {children}
    </StatusContext.Provider>
  );
}
