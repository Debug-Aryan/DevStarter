import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../../context/ProjectContext";
import {
    Shield,
    Container,
    Github,
    FileText,
    Palette,
    Code,
    BookOpen,
    Settings,
    CheckCircle2
} from 'lucide-react';
import { Footer, Navbar } from '../../../../components/layout';
import FeatureCard from './FeatureCard';
import FeatureSummary from './FeatureSummary';

export default function FeatureToggle({ onNext, onBack }) {
    const navigate = useNavigate();
    const { setFeatures: setProjectFeatures } = useProject();

    const [features, setFeatures] = useState({
        auth: true,
        docker: false,
        github: true,
        env: true,
        tailwind: true,
        database: false,
        testing: false,
        deployment: false
    });

    const featureList = [
        {
            id: 'auth',
            title: 'Authentication',
            description: 'JWT tokens, password hashing, and login/register routes pre-configured',
            icon: <Shield className="w-6 h-6" />,
            color: 'from-green-500 to-emerald-600',
            category: 'Security'
        },
        {
            id: 'docker',
            title: 'Docker Setup',
            description: 'Dockerfile, docker-compose.yml, and container orchestration ready',
            icon: <Container className="w-6 h-6" />,
            color: 'from-blue-500 to-cyan-600',
            category: 'DevOps'
        },
        {
            id: 'github',
            title: 'GitHub Init',
            description: 'Initialize Git repository with .gitignore and README template',
            icon: <Github className="w-6 h-6" />,
            color: 'from-gray-600 to-gray-800',
            category: 'Version Control'
        },
        {
            id: 'linting',
            title: 'Prettier + Linter Setup',
            description: 'Pre-configured ESLint and Prettier with project-specific rules',
            icon: <Code className="w-6 h-6" />,
            color: 'from-orange-500 to-red-600',
            category: 'Code Quality'
        },
        {
            id: 'deployment',
            title: 'Deployment Config',
            description: 'Vercel, Netlify, and AWS deployment configurations included',
            icon: <Settings className="w-6 h-6" />,
            color: 'from-violet-500 to-purple-600',
            category: 'Deployment'
        },
        {
            id: 'tailwind',
            title: 'Tailwind CSS',
            description: 'Utility-first CSS framework with custom config and components',
            icon: <Palette className="w-6 h-6" />,
            color: 'from-cyan-500 to-blue-600',
            category: 'Styling'
        },
        {
            id: 'readme',
            title: 'README Generator',
            description: 'Auto-generate professional README with badges, usage, and setup steps',
            icon: <BookOpen className="w-6 h-6" />,
            color: 'from-pink-500 to-rose-600',
            category: 'Documentation'
        },
        {
            id: 'env',
            title: 'Environment File',
            description: 'Pre-configured .env files with common variables and validation',
            icon: <FileText className="w-6 h-6" />,
            color: 'from-yellow-500 to-orange-600',
            category: 'Configuration'
        }

    ];

    const toggleFeature = (featureId) => {
        setFeatures(prev => ({
            ...prev,
            [featureId]: !prev[featureId]
        }));
    };

    const getEnabledFeaturesCount = () => {
        return Object.values(features).filter(Boolean).length;
    };

    const handleGenerate = () => {
        setProjectFeatures(features);
        onNext();
    };

    const handleReset = () => {
        setFeatures(Object.keys(features).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    };

    return (
        <>
            <div className="min-h-screen bg-black text-white p-10">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-white bg-clip-text text-transparent">
                            Customize Your Boilerplate
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                            Add ready-to-use features to your project instantly.
                        </p>

                        {/* Feature Counter */}
                        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium">
                                {getEnabledFeaturesCount()} of {featureList.length} features selected
                            </span>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                        {featureList.map((feature) => (
                            <FeatureCard
                                key={feature.id}
                                feature={feature}
                                isEnabled={features[feature.id]}
                                toggleFeature={toggleFeature}
                            />
                        ))}
                    </div>

                    {/* Summary Section */}
                    <FeatureSummary
                        features={features}
                        featureList={featureList}
                        onNext={onNext}
                        onBack={onBack}
                        onReset={handleReset}
                        onGenerate={handleGenerate}
                    />
                </div>
                <Footer />
            </div>
        </>
    );
}
