import React from "react";
import { Navbar } from "./components/navbar";
import { BgEclipseCircle } from "./components/bg-eclipse-circle";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-tl bg-black h-screen w-screen font-orbitron  ">
      <Navbar />
      <div className="absolute h-full w-full items-center justify-center flex">
        <BgEclipseCircle />
        {children}
      </div>
    </div>
  );
};

export default Layout;
