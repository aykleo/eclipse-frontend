import React from "react";
import { Navbar } from "./components/navbar";
// import { BgEclipseCircle } from "./components/bg-eclipse-circle";
import { useStatus } from "./hooks/status/status-context";
import { StatusToast } from "./components/status-toast";
import { ExerciseInfo } from "./components/exercise/exercise-info";
import { useExerciseState } from "./hooks/exercises/exercise-context";
import { BgEclipseCircle } from "./components/bg-eclipse-circle";
import { DeleteExerciseModal } from "./pages/exercises/delete-modal";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { statusText } = useStatus();
  const { showExerciseInfo } = useExerciseState();

  return (
    <div className="bg-black font-pixelify">
      <Navbar />
      {/* Fixed background element */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BgEclipseCircle />
      </div>
      <div className="relative flex items-center justify-center h-full z-10">
        {children}
      </div>
      {showExerciseInfo && <ExerciseInfo />}
      {statusText && <StatusToast statusText={statusText} />}
      <DeleteExerciseModal />
    </div>
  );
};

export default Layout;
