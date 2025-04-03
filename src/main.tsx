import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Layout from "./layout.tsx";
import { UserProvider } from "./hooks/user/user-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusProvider } from "./hooks/status/status-provider.tsx";
import { NavBarProvider } from "./hooks/navbar-choices/navbar-provider.tsx";
import { ExerciseProvider } from "./hooks/exercises/exercise-provider.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <NavBarProvider>
          <StatusProvider>
            <UserProvider>
              <ExerciseProvider>
                <Layout>
                  <App />
                </Layout>
              </ExerciseProvider>
            </UserProvider>
          </StatusProvider>
        </NavBarProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
