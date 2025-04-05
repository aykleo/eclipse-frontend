import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/home";

import { WorkoutsPage } from "./pages/user/components/workouts/workouts-page";
import { ExercisePage } from "./pages/user/components/execises/exercise-page";
import { RedirectIfLoggedIn } from "./hooks/protected-route/redirect-if-logged-in";
import { ProtectedRoute } from "./hooks/protected-route/protected-route";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfLoggedIn>
            <HomePage />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <WorkoutsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
