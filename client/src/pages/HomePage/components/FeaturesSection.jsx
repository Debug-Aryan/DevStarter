import { features } from '../data/landingPageData';

// black to grey gradient bg top to 800 bg bottom

export default function FeaturesSection() {
    return (
        <section
            id="features"
            className="relative z-10 bg-gradient-to-b from-black to-gray-900 px-6 py-20"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
                    <p className="text-xl text-gray-400">Production-ready features built into every boilerplate</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl border border-gray-700 p-6 hover:bg-white/10 transition-all transform hover:scale-105">
                            <div className="text-blue-400 mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
