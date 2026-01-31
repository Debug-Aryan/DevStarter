import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const GenerateButton = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-3 px-8 py-4 bg-[#161B22] border border-gray-700 rounded-full transition-all duration-300 hover:border-blue-500/50 hover:bg-[#1f2631] active:scale-95 shadow-xl"
      >
        {/* Subtle Background Glow on Hover */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* The Icon - Solid Yellow/Gold for contrast */}
        <Zap className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        
        {/* Main Text */}
        <span className="relative z-10 text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
          Generate Boilerplate
        </span>

        {/* Arrow that slides in on hover */}
        <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        
        {/* Bottom "Glow Line" - purely decorative for that dark-mode depth */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};

export default GenerateButton;