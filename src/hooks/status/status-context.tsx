import { createContext, useContext } from "react";

interface StatusContextType {
  statusText: string | null;
  setStatusText: React.Dispatch<React.SetStateAction<string | null>>;
}

export const StatusContext = createContext<StatusContextType>({
  statusText: null,
  setStatusText: () => {},
});

export function useStatus() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    console.log("useStatus must be used within a StatusProvider");
  }
  return context;
}
