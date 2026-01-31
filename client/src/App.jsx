import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LoadingOverlay from "./components/common/LoadingOverlay";


function App() {
  return (
    <BrowserRouter>
      <LoadingOverlay />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
