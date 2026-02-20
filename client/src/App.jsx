import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LoadingOverlay from "./components/common/LoadingOverlay";
import SmoothCursor from "./components/common/SmoothCursor";


function App() {
  return (
    <BrowserRouter>
      <LoadingOverlay />
      <SmoothCursor />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
