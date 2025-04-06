import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Layout from "./layout.tsx";
import { UserProvider } from "./hooks/user/user-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusProvider } from "./hooks/status/status-provider.tsx";
import { ExerciseProvider } from "./hooks/exercises/exercise-provider.tsx";
import { TemplateProvider } from "./hooks/templates/template-provider.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <StatusProvider>
          <UserProvider>
            <ExerciseProvider>
              <TemplateProvider>
                <Layout>
                  <App />
                </Layout>
              </TemplateProvider>
            </ExerciseProvider>
          </UserProvider>
        </StatusProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
