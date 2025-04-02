import React from "react";
import { Navbar } from "./components/navbar";
import { BgEclipseCircle } from "./components/bg-eclipse-circle";
import { useStatus } from "./hooks/status/status-context";
import { StatusToast } from "./components/status-toast";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { statusText } = useStatus();

  return (
    <div className="bg-gradient-to-tl bg-black min-h-screen font-pixelify">
      <Navbar />
      <div className="relative flex items-center justify-center h-full">
        {/* <BgEclipseCircle /> */}
        {children}
      </div>
      {statusText && <StatusToast statusText={statusText} />}
    </div>
  );
};

export default Layout;
