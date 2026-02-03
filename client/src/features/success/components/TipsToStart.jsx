import { useProject } from "../../../context/ProjectContext";
import { tipsByStack } from "../../../data/tipsByStack";
import { Sparkles } from 'lucide-react';
import listSvg from "../../../assets/success/list-svgrepo-com.svg";
import number1Svg from "../../../assets/success/number-1-svgrepo-com.svg";
import number2Svg from "../../../assets/success/number-2-svgrepo-com.svg";
import number3Svg from "../../../assets/success/number-3-svgrepo-com.svg";
import number4Svg from "../../../assets/success/number-4-svgrepo-com.svg";
import number5Svg from "../../../assets/success/number-5-svgrepo-com.svg";

// 3. TipsToStart Component
export default function TipsToStart() {
    const { stack } = useProject();

    // Get tips for the selected stack, fallback to mern if not found
    const currentTips = tipsByStack[stack] || tipsByStack.mern;
    const stackTitle = stack ? stack.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Project';

    const numberSvgs = [number1Svg, number2Svg, number3Svg, number4Svg, number5Svg];

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-2">
                    <img src={listSvg} alt="Steps" className="w-9 h-9 object-contain" />
                    <h3 className="text-xl font-bold text-white">Next Steps for {stackTitle}</h3>
                </div>
            </div>

            <div className="space-y-4">
                {currentTips.map((tip, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-gray-700/50 hover:bg-white/10 transition-all duration-300"
                    >
                        {/* Step Number & Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                {numberSvgs[index] ? (
                                    <img
                                        src={numberSvgs[index]}
                                        alt={`Step ${index + 1}`}
                                        className="w-7 h-7 object-contain"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-sm">{index + 1}</span>
                                )}
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
        </div>
    );
}
