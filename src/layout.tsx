import React from "react";
import { Navbar } from "./components/navbar";
// import { BgEclipseCircle } from "./components/bg-eclipse-circle";
import { useStatus } from "./hooks/status/status-context";
import { StatusToast } from "./components/status-toast";
import { ExerciseInfo } from "./components/exercise/exercise-info";
import { useExerciseState } from "./hooks/exercises/exercise-context";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { statusText } = useStatus();
  const { showExerciseInfo } = useExerciseState();

  return (
    <div className="bg-gradient-to-tl bg-black min-h-screen font-pixelify">
      <Navbar />
      <div className="relative flex items-center justify-center h-full">
        {/* <BgEclipseCircle /> */}
        {children}
      </div>
      {showExerciseInfo && <ExerciseInfo />}
      {statusText && <StatusToast statusText={statusText} />}
    </div>
  );
};

export default Layout;
