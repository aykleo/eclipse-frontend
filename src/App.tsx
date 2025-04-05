import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/home";

import { WorkoutsPage } from "./pages/user/components/workouts/workouts-page";
import { ExercisePage } from "./pages/user/components/execises/exercise-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:username/exercises" element={<ExercisePage />} />
      <Route path="/:username/workouts" element={<WorkoutsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
