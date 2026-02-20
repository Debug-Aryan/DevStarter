import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Footer } from '../components/layout';
import { DownloadCard, SuccessMessage, TipsToStart } from '../features/success';
import { useProject } from "../context/ProjectContext";




// Main Success Component
export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { generatedFile } = useProject();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const hasGeneratedProject = useMemo(() => {
    if (generatedFile) return true;
    try {
      return Boolean(localStorage.getItem("generatedFile"));
    } catch {
      return false;
    }
  }, [generatedFile]);

  if (!hasGeneratedProject) {
    return (
      <Navigate
        to="/error/auth"
        replace
        state={{ from: location.pathname, errorType: "auth" }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">

          {showSuccessMessage && (
            <SuccessMessage
              title="Download Complete"
              onClose={() => setShowSuccessMessage(false)}
            />
          )}


          {/* Main Content */}
          <div className="space-y-8">

            {/* Header */}
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-white bg-clip-text text-transparent">
                Your Project is Ready! <span className="bg-none text-black">     </span>
              </h1>
              <p className="text-lg text-gray-300">
                Choose how you want to get your customized boilerplate
              </p>
            </div>

            {/* Download Section */}
            <div className="animate-in slide-in-from-bottom duration-700 delay-200">
              <h2 className="text-xl font-semibold mb-4 text-white">Get Your Project</h2>
              <DownloadCard onDownload={() => setShowSuccessMessage(true)} />
            </div>

            {/* Next Steps Section */}
            <div className="animate-in slide-in-from-bottom duration-700 delay-400">
              <TipsToStart />
            </div>

            {/* Bottom Actions */}
            <div className="text-center animate-in fade-in-0 duration-700 delay-600">
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
              >
                ← Generate Another Project
              </button>
            </div>
          </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}