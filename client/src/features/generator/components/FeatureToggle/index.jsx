import { useState } from 'react';
import { useProject } from "../../../../context/ProjectContext";
import {
    CheckCircle2
} from 'lucide-react';

import authSvg from '../../../../assets/features/identity-and-access-management-svgrepo-com.svg';
import dockerSvg from '../../../../assets/features/docker-icon-svgrepo-com.svg';
import githubSvg from '../../../../assets/features/github-142-svgrepo-com.svg';
import lintingSvg from '../../../../assets/features/prettier-svgrepo-com.svg';
import deploymentSvg from '../../../../assets/features/deploy-svgrepo-com.svg';
import tailwindSvg from '../../../../assets/features/tailwind-svgrepo-com.svg';
import readmeSvg from '../../../../assets/features/readme-svgrepo-com.svg';
import envSvg from '../../../../assets/features/gear-file-svgrepo-com.svg';

import { Footer } from '../../../../components/layout';
import FeatureCard from './FeatureCard';
import FeatureSummary from './FeatureSummary';

export default function FeatureToggle({ onNext, onBack }) {
    const { setFeatures: setProjectFeatures } = useProject();

    const [features, setFeatures] = useState({
        auth: true,
        docker: false,
        github: true,
        env: true,
        tailwind: true,
        readme: true,
        database: false,
        testing: false,
        deployment: false
    });

    const featureList = [
        {
            id: 'auth',
            title: 'Authentication',
            description: 'Authentication setup with secure password handling and ready-to-use auth flows',
            icon: authSvg,
            color: 'from-green-500 to-emerald-600',
            category: 'Security'
        },
        {
            id: 'docker',
            title: 'Docker Setup',
            description: 'Dockerfile and docker-compose configuration for containerized development',
            icon: dockerSvg,
            color: 'from-blue-500 to-cyan-600',
            category: 'DevOps'
        },
        {
            id: 'github',
            title: 'Git Repository Setup',
            description: 'Project-ready .gitignore files and structured README templates',
            icon: githubSvg,
            color: 'from-gray-600 to-gray-800',
            category: 'Version Control'
        },
        {
            id: 'linting',
            title: 'Prettier & Linting',
            description: 'Pre-configured linting and formatting rules for consistent code quality',
            icon: lintingSvg,
            color: 'from-orange-500 to-red-600',
            category: 'Code Quality'
        },
        {
            id: 'deployment',
            title: 'Deployment Config',
            description: 'Deployment configurations for platforms like Vercel, Netlify, and Render',
            icon: deploymentSvg,
            color: 'from-violet-500 to-purple-600',
            category: 'Deployment'
        },
        {
            id: 'tailwind',
            title: 'Tailwind CSS',
            description: 'Tailwind CSS setup with custom configuration for supported frontend stacks',
            icon: tailwindSvg,
            color: 'from-cyan-500 to-blue-600',
            category: 'Styling'
        },
        {
            id: 'readme',
            title: 'README Generator',
            description: 'Auto-generated README with project overview, setup instructions, and usage details',
            icon: readmeSvg,
            color: 'from-pink-500 to-rose-600',
            category: 'Documentation'
        },
        {
            id: 'env',
            title: 'Environment Files',
            description: 'Pre-configured .env example files with commonly used environment variables',
            icon: envSvg,
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
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
                <div className="flex-1 p-10">
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
                </div>
                <Footer />
            </div>
        </>
    );
}
