import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export default function FeatureSummary({ features, featureList, onNext, onBack, onReset, onGenerate }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
            <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-2">Your Configuration</h3>
                    <p className="text-gray-400">
                        Review your selected features below. You can always modify these later.
                    </p>
                </div>
            </div>

            {/* Enabled Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {featureList
                    .filter(feature => features[feature.id])
                    .map(feature => (
                        <div key={feature.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                                <div className="text-white">
                                    {feature.icon}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-white">{feature.title}</span>
                                <div className="text-xs text-gray-400">{feature.category}</div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                    onClick={onBack}
                    className="border border-gray-600 px-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                >
                    Back
                </button>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    onClick={onGenerate}
                >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Generate Boilerplate</span>
                </button>
                <button
                    onClick={onReset}
                    className="border border-gray-600 px-4 py-4 rounded-lg font-semibold hover:bg-green-800 transition-all"
                >
                    Reset All
                </button>
            </div>
        </div>
    );
}
