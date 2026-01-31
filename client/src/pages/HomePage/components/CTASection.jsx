import { useNavigate } from "react-router-dom";
import { Zap } from 'lucide-react';

export default function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl border border-gray-600 p-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Building in Seconds</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of developers who've accelerated their workflow with DevStarter
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 rounded-lg text-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto" onClick={() => navigate("/generate")}>
                        <Zap className="w-6 h-6" />
                        <span>Generate Your First Boilerplate</span>
                    </button>
                    <p className="text-gray-400 mt-4">No signup required • Free forever • Open source</p>
                </div>
            </div>
        </section>
    );
}
