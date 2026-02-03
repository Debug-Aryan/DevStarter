import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import GenerateButton from '../../../../components/common/GenerateButton';

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
                            <div className={`inline-flex p-[2px] rounded-xl bg-gradient-to-r ${feature.color}`}>
                                <div className="bg-white rounded-[10px] p-2">
                                    <img
                                        src={feature.icon}
                                        alt={feature.title}
                                        className="w-8 h-8 object-contain"
                                        draggable="false"
                                    />
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
                <GenerateButton label='Back' className='bg-black hover:bg-gray-800 transition-all' onClick={onBack} />
                <GenerateButton label="Generate Boilerplate" onClick={onGenerate} />
                <GenerateButton label='Reset All' className='bg-black hover:bg-red-600 transition-all' onClick={onReset} />
            </div>
        </div>
    );
}
