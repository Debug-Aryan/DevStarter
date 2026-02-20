import { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function SuccessMessage({ isVisible, onComplete }) {
    const [particles, setParticles] = useState([]);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (isVisible) {
            // Generate a more refined confetti/particle burst
            const newParticles = Array.from({ length: 15 }).map((_, i) => ({
                id: i,
                x: 50 + (Math.random() - 0.5) * 100, // Spread from center
                y: 50 + (Math.random() - 0.5) * 100,
                size: Math.random() * 6 + 4,
                rotation: Math.random() * 360,
                delay: Math.random() * 0.2,
                duration: Math.random() * 0.8 + 0.5,
            }));
            setParticles(newParticles);

            // Progress bar animation
            const startTime = Date.now();
            const duration = 3000;

            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);
            }, 10);

            // Auto-hide
            const timer = setTimeout(() => {
                onComplete();
                setProgress(100); // Reset for next time
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed left-0 right-0 top-[calc(env(safe-area-inset-top,0px)+1rem)] sm:top-[calc(env(safe-area-inset-top,0px)+1.5rem)] z-50 flex justify-center pointer-events-none px-4">
            {/* Main Wrapper - Smooth drop-in animation */}
            <div className="relative pointer-events-auto w-full max-w-md animate-in fade-in slide-in-from-top-8 duration-500 ease-out">
                
                {/* Particle Explosion Wrapper */}
                <div className="absolute inset-0 overflow-visible pointer-events-none">
                    {particles.map(particle => (
                        <div
                            key={particle.id}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-out fade-out duration-1000 fill-mode-forwards"
                            style={{
                                transform: `translate(calc(-50% + ${particle.x}px), calc(-50% + ${particle.y}px)) rotate(${particle.rotation}deg)`,
                                transition: `transform ${particle.duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${particle.duration}s ease-in-out`,
                                transitionDelay: `${particle.delay}s`,
                                opacity: 0,
                            }}
                        >
                            <Sparkles
                                className="text-emerald-400/80 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                size={particle.size}
                            />
                        </div>
                    ))}
                </div>

                {/* The Flash Card */}
                <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-1 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] group transition-all hover:border-emerald-500/40 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)]">
                    
                    {/* Inner glowing gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-green-500/10 opacity-50"></div>

                    <div className="relative flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-4 p-4 pr-12">
                        {/* Icon Container with rotating glow */}
                        <div className="relative flex-shrink-0 self-center sm:self-auto">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                            <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-inner">
                                <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center justify-center sm:justify-start gap-2 leading-tight">
                                Boilerplate Ready! 
                                <span className="text-xl animate-bounce origin-bottom inline-block" style={{ animationDuration: '2s' }}>🎉</span>
                            </h2>
                            <p className="text-emerald-200/80 text-sm font-medium mt-0.5">
                                Your project has downloaded successfully.
                            </p>
                        </div>

                        {/* Optional Manual Dismiss Button */}
                        <button 
                            onClick={onComplete}
                            aria-label="Dismiss success message"
                            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}