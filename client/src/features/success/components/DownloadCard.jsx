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
        try {
            // Show a short local "Downloading" state before starting the browser download.
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const link = document.createElement('a');
            link.href = generatedFile.url;
            link.download = generatedFile.fileName;
            // Prevent the global click-capture loader from blocking the file download.
            link.setAttribute('data-no-loader', 'true');
            link.setAttribute('data-no-delay', 'true');
            document.body.appendChild(link);
            link.click();
            link.remove();

            if (onDownload) onDownload();
        } finally {
            setIsDownloading(false);
        }
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
                            data-no-loader="true"
                            data-no-delay="true"
                            className="group relative w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 bg-emerald-500 text-slate-900 border border-emerald-200/60 hover:bg-emerald-300 hover:border-emerald-100/80"
                        >
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {isDownloading ? (
                                <div className="relative z-10 w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Download className="relative z-10 w-5 h-5 text-slate-900" />
                            )}
                            <span className="relative z-10 text-sm font-semibold">Download ZIP File</span>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        {/* Upload to GitHub Button */}
                        <button
                            onClick={handleGithubUpload}
                            disabled={isUploading || isDownloading}
                            data-no-loader="true"
                            data-no-delay="true"
                            className="group relative w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 bg-gradient-to-r from-[#070a0f] via-[#0f141c] to-[#161B22] text-gray-200 border border-gray-700 hover:border-gray-500/70 hover:from-[#0b1018] hover:to-[#1f2631]"
                        >
                            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {isUploading ? (
                                <div className="relative z-10 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Github className="relative z-10 w-5 h-5 text-gray-200" />
                            )}
                            <span className="relative z-10 text-sm font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">Upload to GitHub</span>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
