import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProjectProvider } from "./context/ProjectContext"; // ✅ import the context

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProjectProvider> {/* ✅ wrap App inside the context provider */}
      <App />
    </ProjectProvider>
  </StrictMode>
);
