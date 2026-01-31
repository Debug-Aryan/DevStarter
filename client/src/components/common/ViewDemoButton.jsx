import { Play } from 'lucide-react';

export default function ViewDemoButton() {
  return (
    <button className="group flex items-center justify-center space-x-3 px-8 py-4 bg-transparent border border-gray-800 rounded-full hover:bg-white/5 hover:border-gray-600 transition-all duration-300 active:scale-95">
      {/* Play Icon Container */}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
        <Play className="w-3.5 h-3.5 text-gray-300 fill-current translate-x-[1px]" />
      </div>
      
      {/* Button Text */}
      <span className="text-gray-400 group-hover:text-gray-200 font-medium tracking-wide">
        View Demo
      </span>
    </button>
  );
}