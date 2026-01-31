import { Navbar, Footer } from '../../components/layout';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import CodePreviewSection from './components/CodePreviewSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';

export default function DevStarterLanding() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white overflow-hidden relative">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CodePreviewSection />
                <TestimonialsSection />
                <CTASection />
                <Footer />
            </div>
        </>
    );
}
