import React from "react";
import { Navbar } from "./components/navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-bl from-stone-900 via-stone-900 to-red-900 h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
