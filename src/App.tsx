import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home";
import { UserPage } from "./pages/user";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:username" element={<UserPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
