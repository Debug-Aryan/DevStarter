import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Play } from 'lucide-react';
import Squares from "../../../components/common/Squares";
import TextType from "../../../components/common/TextType";
import GenerateButton from "../../../components/common/GenerateButton";


export default function HeroSection() {
    const navigate = useNavigate();
    const squaresHostRef = useRef(null);
    const squaresCanvasRef = useRef(null);

    useEffect(() => {
        squaresCanvasRef.current = squaresHostRef.current?.querySelector("canvas") ?? null;
    }, []);

    const forwardMouseMoveToCanvas = (event) => {
        const canvas = squaresCanvasRef.current;
        if (!canvas) return;

        canvas.dispatchEvent(
            new MouseEvent("mousemove", {
                bubbles: true,
                clientX: event.clientX,
                clientY: event.clientY,
            })
        );
    };

    const forwardMouseLeaveToCanvas = () => {
        const canvas = squaresCanvasRef.current;
        if (!canvas) return;

        canvas.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    };

    return (
        <section
            className="relative overflow-hidden py-20 min-h-[520px]"
            onMouseMove={forwardMouseMoveToCanvas}
            onMouseLeave={forwardMouseLeaveToCanvas}
        >
            <div ref={squaresHostRef} className="absolute inset-0 z-0 opacity-100">
                <Squares
                    direction="diagonal"
                    speed={0.5}
                    borderColor="rgba(255,255,255,0.22)"
                    hoverFillColor="rgba(168,85,247,0.25)"
                    squareSize={50}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40">
                <div className="text-center max-w-4xl mx-auto">
                    <TextType
                        as="div"
                        text={["Kickstart Your Project in Seconds", "Generate full-stack boilerplates instantly.", "Skip setup. Start building."]}
                        typingSpeed={75}
                        initialDelay={0}
                        deletingSpeed={50}
                        loop={true}
                        cursorCharacter="|"
                        showCursor={true}
                        cursorBlinkDuration={0.5}
                        className="text-3xl md:text-6xl font-bold mb-6 bg-white bg-clip-text text-transparent leading-tight md:leading-[1.1] pb-2 min-h-[5rem] md:min-h-[9rem]"
                    />

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 mb-12">
                        <GenerateButton onClick={() => navigate("/generate")} />
                        <GenerateButton label="View Demo" className="bg-transparent border border-gray-800 rounded-full hover:bg-white/5 hover:border-gray-600 transition-all duration-300 active:scale-95" onClick={() => navigate("/generate")} />
                    </div>
                </div>
            </div>
        </section>
    );
}
