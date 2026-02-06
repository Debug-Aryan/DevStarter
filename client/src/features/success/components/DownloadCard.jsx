import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from "../../../context/ProjectContext";
import zipFolderSvg from "../../../assets/success/zip-folder.svg";
import {
    Download,
    FileText,
    HardDrive,
    Github,
} from 'lucide-react';
import { buildGithubAuthorizeUrl, publishToGithub } from '../../../services/githubPublish';

// 2. DownloadCard Component
export default function DownloadCard({ onDownload }) {
    const { generatedFile } = useProject();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [repoUrl, setRepoUrl] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const publishStartedRef = useRef(false);
    // const projectData = {
    //   fileName: generatedFile.fileName,
    //   fileSize: generatedFile.fileSize,
    //   filesCount: 47
    // };
    const projectData = generatedFile || JSON.parse(localStorage.getItem("generatedFile"));

    const repoName = useMemo(() => {
        const raw = projectData?.fileName || '';
        return raw.toLowerCase().endsWith('.zip') ? raw.slice(0, -4) : raw;
    }, [projectData]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const connected = params.get('github_connected');
        const oauthError = params.get('github_error');
        const githubSession = params.get('github_session');

        if (githubSession) {
            try {
                // Store as a fallback when third-party cookies are blocked.
                sessionStorage.setItem('ds_github_session', githubSession);
                // Also mirror into localStorage so refreshes don't lose it.
                localStorage.setItem('ds_github_session', githubSession);
            } catch {
                // ignore
            }
        }

        if (oauthError) {
            // Security hardening: backend no longer leaks detailed errors in the URL.
            setPublishError(oauthError);
            // Clear error params from the URL.
            navigate('/success', { replace: true });
            return;
        }

        if (!connected) return;

        // React StrictMode in dev runs effects twice. Guard to avoid double-publishing.
        if (publishStartedRef.current) {
            return;
        }
        publishStartedRef.current = true;

        (async () => {
            setIsUploading(true);
            setPublishError(null);
            try {
                const projectId = projectData?.projectId;
                if (!projectId) {
                    throw new Error('Missing projectId. Please regenerate the project and try again.');
                }

                // Extra guard to prevent double publish across remounts (e.g. mobile layout changes).
                const publishGuardKey = `ds_publish_started:${projectId}`;
                const repoUrlKey = `ds_repo_url:${projectId}`;
                if (sessionStorage.getItem(publishGuardKey) === '1') {
                    // If publish already happened in this browser session, restore the repo URL.
                    const existingRepoUrl = sessionStorage.getItem(repoUrlKey);
                    if (existingRepoUrl) {
                        setRepoUrl(existingRepoUrl);
                    }
                    // Clear params to avoid re-triggering publish on refresh.
                    navigate('/success', { replace: true });
                    return;
                }
                sessionStorage.setItem(publishGuardKey, '1');

                if (!repoName) {
                    throw new Error('Missing repo name.');
                }

                const result = await publishToGithub({ repoName, projectId });
                setRepoUrl(result.repoUrl);
                sessionStorage.setItem(repoUrlKey, result.repoUrl);
            } catch (err) {
                // Allow retry after a failure.
                try {
                    const projectId = projectData?.projectId;
                    if (projectId) {
                        sessionStorage.removeItem(`ds_publish_started:${projectId}`);
                        sessionStorage.removeItem(`ds_repo_url:${projectId}`);
                    }
                } catch {
                    // ignore
                }
                setPublishError(err.message || 'Failed to publish to GitHub');
            } finally {
                setIsUploading(false);
                // Clear token from URL to avoid re-publishing on refresh.
                navigate('/success', { replace: true });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

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
        setPublishError(null);
        setRepoUrl(null);

        if (!projectData?.projectId) {
            setPublishError('Missing projectId. Please regenerate the project first.');
            return;
        }

        try {
            const url = buildGithubAuthorizeUrl();
            window.location.assign(url);
        } catch (err) {
            setPublishError(err.message || 'Failed to start GitHub OAuth');
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 transition-all duration-300 shadow-xl">

            <div className="flex items-start space-x-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                    <img
                        src={zipFolderSvg}
                        alt="ZIP folder"
                        className="w-8 h-8 object-contain"
                    />
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
                                {isUploading && "Publishing to GitHub (this may take a moment)..."}
                            </p>
                        </div>
                    )}

                    {publishError && (
                        <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                            <p className="text-red-300 text-sm text-center">{publishError}</p>
                        </div>
                    )}

                    {repoUrl && (
                        <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <p className="text-emerald-200 text-sm text-center">
                                Published successfully:{' '}
                                <a
                                    href={repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline hover:text-white"
                                >
                                    {repoUrl}
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
