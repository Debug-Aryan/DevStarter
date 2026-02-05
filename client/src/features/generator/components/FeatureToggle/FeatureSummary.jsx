import React from 'react';
import infoSvg from '../../../../assets/features/information-svgrepo-com.svg';
import GenerateButton from '../../../../components/common/GenerateButton';
import backSvg from '../../../../assets/back-svgrepo-com.svg';
import resetSvg from '../../../../assets/reset-svgrepo-com.svg';

export default function FeatureSummary({ features, featureList, onNext, onBack, onReset, onGenerate }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
            <div className="flex items-start space-x-4 mb-6">
                <div className="shrink-0">
                    <img
                        src={infoSvg}
                        alt="Information"
                        className="w-11 h-11 object-contain invert"
                        draggable="false"
                    />
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
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] gap-2 items-center w-full sm:flex sm:flex-row sm:gap-6 sm:justify-center">
                {/* Mobile: plain buttons */}
                <button
                    type="button"
                    aria-label="Back"
                    onClick={onBack}
                    className="sm:hidden w-12 h-12 aspect-square rounded-full shrink-0 grid place-items-center bg-black border border-gray-700 hover:bg-gray-800 transition-all"
                >
                    <img
                        src={backSvg}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        className="h-5 w-5 object-contain filter brightness-0 invert"
                    />
                </button>

                {/* Desktop/tablet: GenerateButton */}
                <div className="hidden sm:block">
                    <GenerateButton label='Back' className='bg-black hover:bg-gray-800 transition-all' onClick={onBack} />
                </div>

                {/* Mobile: plain button */}
                <button
                    type="button"
                    onClick={onGenerate}
                    className="sm:hidden w-full min-w-0 h-12 px-5 bg-[#161B22] border border-gray-700 rounded-full cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-[#1f2631] active:scale-95 shadow-xl"
                >
                    <span className="text-base font-semibold text-gray-200">Generate</span>
                </button>

                {/* Desktop/tablet: GenerateButton */}
                <div className="hidden sm:block w-full">
                    <GenerateButton
                        label="Generate Boilerplate"
                        wrapperClassName="p-0 sm:p-4"
                        className="w-full h-12 sm:h-14"
                        onClick={onGenerate}
                    />
                </div>

                {/* Mobile: plain buttons */}
                <button
                    type="button"
                    aria-label="Reset all"
                    onClick={onReset}
                    className="sm:hidden w-12 h-12 aspect-square rounded-full shrink-0 grid place-items-center bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/40 transition-all"
                >
                    <img
                        src={resetSvg}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        className="h-5 w-5 object-contain filter brightness-0 invert"
                    />
                </button>

                {/* Desktop/tablet: GenerateButton */}
                <div className="hidden sm:block">
                    <GenerateButton label='Reset All' className='bg-black hover:bg-red-600 transition-all' onClick={onReset} />
                </div>
            </div>
        </div>
    );
}
