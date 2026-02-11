import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Squares from "../../../components/common/Squares";
import TextType from "../../../components/common/TextType";
import DemoVideoModal from "../../../components/common/DemoVideoModal";
import HeroButton from "../../../components/common/HeroButton";
import PlayButton from "../../../components/common/PlayButton";


export default function HeroSection() {
    const navigate = useNavigate();
    const squaresHostRef = useRef(null);
    const squaresCanvasRef = useRef(null);
    const viewDemoButtonRef = useRef(null);

    const [isDemoOpen, setIsDemoOpen] = useState(false);

    const viewDemoRect = useMemo(() => {
        if (!isDemoOpen) return null;
        const el = viewDemoButtonRef.current;
        if (!el) return null;
        return el.getBoundingClientRect();
    }, [isDemoOpen]);

    useEffect(() => {
        squaresCanvasRef.current = squaresHostRef.current?.querySelector("canvas") ?? null;
    }, []);

    const forwardMouseMoveToCanvas = (event) => {
        const canvas = squaresCanvasRef.current;
        if (!canvas) return;
        if (event.target === canvas) return;

        canvas.dispatchEvent(
            new MouseEvent("mousemove", {
                bubbles: false,
                clientX: event.clientX,
                clientY: event.clientY,
            })
        );
    };

    const forwardMouseLeaveToCanvas = () => {
        const canvas = squaresCanvasRef.current;
        if (!canvas) return;

        canvas.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
    };

    return (
        <section
            className="relative overflow-hidden py-32 min-h-[520px]"
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

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-30">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="h-[7.5rem] md:h-[11rem] flex items-center justify-center mb-6">
                        <TextType
                            as="div"
                            text={["Kickstart Your Project in Seconds", "Generate full-stack boilerplates instantly.", "Skip setup. Start building."]}
                            typingSpeed={75}
                            initialDelay={10}
                            deletingSpeed={50}
                            loop={true}
                            cursorCharacter="_"
                            showCursor={true}
                            cursorBlinkDuration={0.5}
                            className="text-3xl md:text-6xl font-bold bg-white bg-clip-text text-transparent leading-tight md:leading-[1.1] pb-2 overflow-hidden"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-24 justify-center mt-6 mb-12 sm:flex-nowrap pt-10">
                        <HeroButton label="Get Started" onClick={() => navigate("/generate")} />
                        <PlayButton
                            ref={viewDemoButtonRef}
                            label="VIEW DEMO"
                            data-no-loader="true"
                            onClick={() => setIsDemoOpen(true)}
                        />
                    </div>

                    <DemoVideoModal
                        isOpen={isDemoOpen}
                        onClose={() => setIsDemoOpen(false)}
                        videoId="LXb3EKWsInQ"
                        triggerRect={viewDemoRect}
                    />
                </div>
            </div>
        </section>
    );
}
