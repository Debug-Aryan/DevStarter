import { steps } from '../data/landingPageData';

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative z-10 bg-gradient-to-b from-gray-900 to-black px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-gray-400">Three simple steps to your perfect boilerplate</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/30 border border-white/20">
                                <svg
                                    className="w-13 h-13"
                                    viewBox="0 0 64 64"
                                    role="img"
                                    aria-label={`Step ${step.number}`}
                                >
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#0B0F1A"
                                        fontSize="28"
                                        fontWeight="700"
                                        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji"
                                    >
                                        {step.number}
                                    </text>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                            <p className="text-gray-400 text-lg">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
