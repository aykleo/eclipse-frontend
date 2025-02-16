import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Layout from "./layout.tsx";
import { UserProvider } from "./hooks/user-hooks/user-context.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    <BrowserRouter>
      <UserProvider>
        <Layout>
          <App />
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
