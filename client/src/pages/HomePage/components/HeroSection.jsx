import { useNavigate } from "react-router-dom";
import { Download, Play } from 'lucide-react';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 px-6 pt-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Kickstart your Next App in Seconds
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                        DevStarter lets developers instantly generate full-stack boilerplates with just one click.
                        <br className="hidden md:block" />
                        Save time. Skip the setup. Start building.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2" onClick={() => navigate("/generate")}>
                            <Download className="w-5 h-5" />
                            <span>Generate Boilerplate</span>
                        </button>
                        <button className="border border-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>View Demo</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
