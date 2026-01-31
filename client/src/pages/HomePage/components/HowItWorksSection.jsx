import { steps } from '../data/landingPageData';

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative z-10 px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-gray-400">Three simple steps to your perfect boilerplate</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                {step.number}
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
