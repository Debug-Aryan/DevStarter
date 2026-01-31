import { useState } from 'react';
import { useProject } from "../../../context/ProjectContext";
import {
    Download,
    FileText,
    Package,
    HardDrive,
    Github,
} from 'lucide-react';

// 2. DownloadCard Component
export default function DownloadCard({ onDownload }) {
    const { generatedFile } = useProject();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    // const projectData = {
    //   fileName: generatedFile.fileName,
    //   fileSize: generatedFile.fileSize,
    //   filesCount: 47
    // };
    const projectData = generatedFile || JSON.parse(localStorage.getItem("generatedFile"));

    if (!projectData) {
        return (
            <div className="text-center p-6 bg-white/5 rounded-xl border border-gray-700">
                <p className="text-gray-400">No project data found. Please generate a project first.</p>
            </div>
        );
    }

    const handleDownload = async () => {
        if (!generatedFile) return;
        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // small delay for UI

        if (onDownload) onDownload();

        const link = document.createElement('a');
        link.href = generatedFile.url;
        link.download = generatedFile.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setIsDownloading(false);
    };

    const handleGithubUpload = async () => {
        setIsUploading(true);
        // Simulate GitHub upload process
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsUploading(false);

        // In real app, this would create a GitHub repository
        alert('Repository created successfully on GitHub!');
    };

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 hover:bg-white/10 transition-all duration-300 shadow-xl">

            <div className="flex items-start space-x-4">
                {/* File Icon */}
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                </div>

                {/* File Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                            {projectData.fileName}
                        </h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            ZIP
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                        <div className="flex items-center space-x-1">
                            <HardDrive className="w-4 h-4" />
                            <span>{projectData.fileSize}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{projectData.filesCount} files</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading || isUploading}
                            className={`
                px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform
                flex items-center justify-center space-x-2
                ${isDownloading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : isUploading
                                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                                }
              `}
                        >
                            {isDownloading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span className="text-sm">Download</span>
                                </>
                            )}
                        </button>

                        {/* Upload to GitHub Button */}
                        <button
                            onClick={handleGithubUpload}
                            disabled={isUploading || isDownloading}
                            className={`
                px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform
                flex items-center justify-center space-x-2
                ${isUploading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : isDownloading
                                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600'
                                }
              `}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Github className="w-4 h-4" />
                                    <span className="text-sm">Upload to GitHub</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Status Message */}
                    {(isDownloading || isUploading) && (
                        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <p className="text-blue-300 text-sm text-center">
                                {isDownloading && "Preparing your download..."}
                                {isUploading && "Creating repository on GitHub..."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
