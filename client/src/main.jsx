import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProjectProvider } from "./context/ProjectContext"; // ✅ import the context
import { LoadingProvider } from "./context/LoadingContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <ProjectProvider> {/* ✅ wrap App inside the context provider */}
        <App />
      </ProjectProvider>
    </LoadingProvider>
  </StrictMode>
);
