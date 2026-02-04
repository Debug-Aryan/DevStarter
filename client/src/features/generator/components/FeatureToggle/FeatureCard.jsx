import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function FeatureCard({ feature, isEnabled, toggleFeature }) {
    return (
        <div
            className={`
        relative group cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isEnabled ? 'scale-105' : ''}
      `}
            onClick={() => toggleFeature(feature.id)}
        >
            {/* Feature Card */}
            <div className={`
        relative h-full bg-white/5 backdrop-blur-lg rounded-2xl border transition-all duration-300 p-6
        ${isEnabled
                    ? 'border-blue-400 bg-white/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-white/8'
                }
      `}>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`
            text-xs px-2 py-1 rounded-full font-medium transition-all duration-300
            ${isEnabled
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-gray-700/50 text-gray-400'
                        }
          `}>
                        {feature.category}
                    </span>
                </div>

                {/* Feature Icon */}
                <div
                    className={`
          inline-flex p-[2px] rounded-2xl bg-gradient-to-r ${feature.color} mb-4
          ${isEnabled ? 'shadow-lg shadow-black/30' : 'opacity-90 group-hover:opacity-100'}
          transition-all duration-300
        `}
                >
                    <div className="bg-[#F4F7FF] rounded-[14px] p-3 overflow-hidden">
                        <img
                            src={feature.icon}
                            alt={feature.title}
                            className="w-8 h-8 object-contain scale-110"
                            draggable="false"
                        />
                    </div>
                </div>

                {/* Feature Title */}
                <h3 className={`
          text-lg font-semibold mb-3 transition-colors duration-300
          ${isEnabled ? 'text-blue-300' : 'text-white group-hover:text-blue-300'}
        `}>
                    {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {feature.description}
                </p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>

                    <div className={`
            relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer
            ${isEnabled
                            ? 'bg-green-700'
                            : 'bg-gray-600'
                        }
          `}>
                        <div className={`
              absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 transform
              ${isEnabled ? 'translate-x-7' : 'translate-x-1'}
            `} />
                    </div>
                </div>

                {/* Selection Overlay */}
                {isEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
                )}
            </div>
        </div>
    );
}
