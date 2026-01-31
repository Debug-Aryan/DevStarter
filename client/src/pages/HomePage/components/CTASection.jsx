import { useNavigate } from "react-router-dom";
import { Zap } from 'lucide-react';
import GenerateButton from "../../../components/common/GenerateButton";

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
                    <GenerateButton onClick={() => navigate("/generate")} />
                    <p className="text-gray-400 mt-4">No signup required • Free forever • Open source</p>
                </div>
            </div>
        </section>
    );
}
