import { useState, ReactNode, useEffect } from "react";
import { StatusContext } from "./status-context";

export function StatusProvider({ children }: { children: ReactNode }) {
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    if (statusText) {
      const timeout = setTimeout(() => {
        setStatusText(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [statusText]);

  return (
    <StatusContext.Provider value={{ statusText, setStatusText }}>
      {children}
    </StatusContext.Provider>
  );
}
