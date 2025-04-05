import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/home";
import { RedirectIfLoggedIn } from "./hooks/protected-route/redirect-if-logged-in";
import { ProtectedRoute } from "./hooks/protected-route/protected-route";
import { WorkoutsPage } from "./pages/workouts/workouts-page";
import { ExerciseCodex } from "./pages/exercises/exercise-codex/exercise-codex";

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
            <ExerciseCodex />
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
