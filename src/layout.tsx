import React from "react";
import { Navbar } from "./components/navbar";
import { BgEclipseCircle } from "./components/bg-eclipse-circle";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-tl bg-black min-h-screen font-orbitron">
      <Navbar />
      <div className="relative flex items-center justify-center min-h-screen">
        <BgEclipseCircle />
        {children}
      </div>
    </div>
  );
};

export default Layout;
