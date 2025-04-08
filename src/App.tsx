import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/home";
import { RedirectIfLoggedIn } from "./hooks/protected-route/redirect-if-logged-in";
import { ProtectedRoute } from "./hooks/protected-route/protected-route";
import { lazy, Suspense } from "react";
import { ExercisePage } from "./pages/exercises/exercise-page";
import { SmallLoadingGif } from "./components/small-loading-gif";

const WorkoutsPage = lazy(() => import("./pages/workouts/workouts-page"));

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
            <Suspense
              fallback={
                <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
                  <SmallLoadingGif />
                </div>
              }
            >
              <WorkoutsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
