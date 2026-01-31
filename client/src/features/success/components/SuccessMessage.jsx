// 1. SuccessMessage Component - Flash card that appears above content
import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

export default function SuccessMessage({ isVisible, onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (isVisible) {
            // Generate celebration particles
            const newParticles = [];
            for (let i = 0; i < 12; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 20 + 25,
                    size: Math.random() * 4 + 2,
                    delay: Math.random() * 0.3,
                    duration: Math.random() * 1.5 + 1
                });
            }
            setParticles(newParticles);

            // Auto-hide after 3 seconds
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="relative mb-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            {/* Celebration Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute animate-bounce"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`
                        }}
                    >
                        <Sparkles
                            className="text-yellow-400"
                            size={particle.size}
                        />
                    </div>
                ))}
            </div>

            {/* Flash Card */}
            <div className="hidden max-[1369px]:block bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 backdrop-blur-lg rounded-2xl border border-green-500/40 p-6 text-center shadow-2xl animate-pulse">
                <div className="flex items-center justify-center space-x-3">
                    {/* Checkmark Icon */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in-0 duration-500">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse"></div>
                    </div>

                    {/* Success Text */}
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-white animate-in slide-in-from-right-2 duration-500 delay-200">
                            Boilerplate Ready! 🎉
                        </h2>
                        <p className="text-green-300 text-sm animate-in slide-in-from-right-2 duration-500 delay-300">
                            Your project has been downloaded successfully
                        </p>
                    </div>
                </div>
            </div>


            {/* Toast Notification */}
            <div className={`hidden min-[1370px]:block fixed top-130 right-6 z-50 transform transition-all duration-500 ease-in-out animate-pulse
  ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>

                <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 
                  backdrop-blur-lg rounded-2xl border border-green-500/40 p-6 
                  text-left shadow-2xl flex items-center space-x-3 w-80">

                    {/* Checkmark Icon */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 
                      rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse"></div>
                    </div>

                    {/* Success Text */}
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            Boilerplate Ready! 🎉
                        </h2>
                        <p className="text-green-300 text-sm">
                            Your project has been downloaded successfully
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
