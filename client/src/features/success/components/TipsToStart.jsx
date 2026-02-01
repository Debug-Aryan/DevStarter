import { useProject } from "../../../context/ProjectContext";
import { tipsByStack } from "../../../data/tipsByStack";
import { Sparkles } from 'lucide-react';

// 3. TipsToStart Component
export default function TipsToStart() {
    const { stack } = useProject();

    // Get tips for the selected stack, fallback to mern if not found
    const currentTips = tipsByStack[stack] || tipsByStack.mern;
    const stackTitle = stack ? stack.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Project';

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Next Steps for {stackTitle}</h3>
            </div>

            <div className="space-y-4">
                {currentTips.map((tip, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-gray-700/50 hover:bg-white/10 transition-all duration-300"
                    >
                        {/* Step Number & Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="text-blue-400">
                                    {tip.icon}
                                </div>
                                <h4 className="font-semibold text-white">{tip.title}</h4>
                            </div>

                            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                                {tip.description}
                            </p>

                            {/* Command */}
                            {tip.command && (
                                <div className="bg-black/50 rounded-lg p-3 border border-gray-600">
                                    <code className="text-green-400 text-sm font-mono">
                                        $ {tip.command}
                                    </code>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Help */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <p className="text-sm text-gray-300 text-center">
                    Need help? Check out our{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                        documentation
                    </a>{' '}
                    or join our{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                        community
                    </a>
                </p>
            </div>
        </div>
    );
}
