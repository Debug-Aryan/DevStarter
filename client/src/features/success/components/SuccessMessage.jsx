import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function SuccessMessage({
    title = "Success",
    message = "Your project has been downloaded successfully.",
    duration = 4000,
    onClose
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="w-full flex justify-center mb-6 animate-slide-down">
            <div
                className="
                    w-full max-w-xl
                    flex items-start gap-3
                    rounded-2xl
                    border border-emerald-500/30
                    bg-emerald-500/10 backdrop-blur-md
                    px-5 py-4
                    shadow-xl
                "
                role="alert"
            >
                {/* Icon */}
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5 shrink-0" />

                {/* Content */}
                <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-300">
                        {title}
                    </p>
                    <p className="text-sm text-emerald-100">
                        {message}
                    </p>
                </div>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="text-emerald-300 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}