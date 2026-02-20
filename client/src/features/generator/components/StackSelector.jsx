import { useState } from 'react';
import { useProject } from "../../../context/ProjectContext";
import { CheckCircle2, Circle } from 'lucide-react';
import { Footer } from '../../../components/layout';
import GenerateButton from '../../../components/common/GenerateButton';

import mernIcon from '../../../assets/stacks/mern.svg';
import nextJsIcon from '../../../assets/stacks/nextjs-icon-svgrepo-com.svg';
import nodeExpressIcon from '../../../assets/stacks/nodejs-logo-svgrepo-com.svg';
import djangoIcon from '../../../assets/stacks/django-svgrepo-com.svg';
import springBootIcon from '../../../assets/stacks/Spring_Boot.svg';
import flaskIcon from '../../../assets/stacks/icons8-flask-50.svg';
import fullStackTsIcon from '../../../assets/stacks/typescript-icon-svgrepo-com.svg';
import reactNativeIcon from '../../../assets/stacks/icons8-react-native-50.svg';

export default function StackSelector({ onNext }) {
    const { setStack } = useProject();

    const [selectedStack, setSelectedStack] = useState(null);

    const iconNode = (src, alt, { bgColor } = {}) => {
        const hasBg = Boolean(bgColor);
        const img = (
            <img
                src={src}
                alt={alt}
                className={`${hasBg ? 'w-full h-full' : 'w-12 h-12'} object-contain block`}
                loading="lazy"
                draggable={false}
            />
        );

        if (!hasBg) return img;

        return (
            <div
                className="w-12 h-12 rounded-lg p-1 flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
            >
                {img}
            </div>
        );
    };

    const stacks = [
        {
            id: 'mern',
            title: 'MERN Stack',
            description: 'MongoDB, Express.js, React, Node.js - Full-stack JavaScript solution',
            icon: (
                <img
                    src={mernIcon}
                    alt="MERN"
                    className="w-14 h-14 object-contain block rounded-2xl"
                    loading="lazy"
                    draggable={false}
                />
            ),
            color: 'from-green-500 to-emerald-600',
            tags: ['MongoDB', 'Express', 'React', 'Node.js'],
            popular: true
        },
        {
            id: 'nextjs',
            title: 'Next.js',
            description: 'React framework with SSR, SSG, API routes, and great DX',
            icon: iconNode(nextJsIcon, 'Next.js', { bgColor: '#ffffff' }),
            color: 'from-black-200 to-gray-600',
            tags: ['React', 'SSR', 'SSG', 'API Routes'],
            popular: true
        },
        {
            id: 'node-express',
            title: 'Node.js + Express',
            description: 'Backend-focused stack for building robust APIs and microservices',
            icon: iconNode(nodeExpressIcon, 'Node.js + Express', { bgColor: '#0B0F14' }),
            color: 'from-yellow-500 to-orange-600',
            tags: ['Node.js', 'Express', 'REST API', 'Backend'],
            popular: false
        },
        {
            id: 'django',
            title: 'Django',
            description: 'Python-based web framework with batteries included and rapid development',
            icon: iconNode(djangoIcon, 'Django', { bgColor: '#0B0F14' }),
            color: 'from-green-600 to-emerald-700',
            tags: ['Python', 'Django', 'ORM', 'Full-Stack'],
            popular: true
        },
        {
            id: 'spring-boot',
            title: 'Spring Boot',
            description: 'Java framework for enterprise-grade applications and microservices',
            icon: iconNode(springBootIcon, 'Spring Boot', { bgColor: 'rgb(249, 249, 249)' }),
            color: 'from-blue-700 to-green-600',
            tags: ['Java', 'Spring', 'REST', 'Enterprise'],
            popular: true
        },
        {
            id: 'flask',
            title: 'Flask',
            description: 'Lightweight Python microframework for building APIs quickly',
            icon: iconNode(flaskIcon, 'Flask', { bgColor: '#ffffff' }),
            color: 'from-yellow-400 to-red-500',
            tags: ['Python', 'Flask', 'Microframework', 'API'],
            popular: false
        },
        {
            id: 'full-stack-ts',
            title: 'Full-Stack TypeScript',
            description: 'End-to-end TypeScript with React, Node.js, and PostgreSQL',
            icon: iconNode(fullStackTsIcon, 'Full-Stack TypeScript'),
            color: 'from-blue-600 to-purple-700',
            tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
            popular: true
        },
        {
            id: 'react-native',
            title: 'React Native',
            description: 'Cross-platform mobile development with React and native performance',
            icon: iconNode(reactNativeIcon, 'React Native', { bgColor: '#ffffff' }),
            color: 'from-blue-500 to-cyan-600',
            tags: ['React', 'Mobile', 'iOS', 'Android'],
            popular: true
        }
    ];


    const handleStackSelect = (stackId) => {
        const isDeselecting = selectedStack === stackId;
        setSelectedStack(isDeselecting ? null : stackId);

        if (!isDeselecting) {
            setStack(stackId); // Store selected stack globally
        }
    };


    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-white bg-clip-text text-transparent">
                            Choose Your Stack
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Choose a tech stack — preconfigured and ready to build.
                        </p>
                    </div>

                    {/* Stack Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
                        {stacks.map((stack) => {
                            const isSelected = selectedStack === stack.id;

                            return (
                                <div
                                    key={stack.id}
                                    onClick={() => handleStackSelect(stack.id)}
                                    className={`
                                    relative group transition-all duration-300 transform hover:scale-105
                  ${isSelected ? 'scale-105' : ''}
                `}
                                >
                                    {/* Popular Badge */}
                                    {stack.popular && (
                                        <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                            Popular
                                        </div>
                                    )}

                                    {/* Selection Indicator */}
                                    <div className="absolute top-4 right-4 z-10">
                                        {isSelected ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" />
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div className={`
                  relative h-full bg-white/5 backdrop-blur-lg rounded-2xl border transition-all duration-300
                  ${isSelected
                                            ? 'border-blue-400 bg-white/10 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-700 hover:border-gray-600 hover:bg-white/8'
                                        }
                `}>
                                        {/* Gradient Accent Bar */}
                                        <div className={`
                    h-2 rounded-t-full bg-gradient-to-r ${stack.color}
                    ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}
                    transition-opacity duration-300
                  `} />

                                        <div className="p-6">
                                            {/* Icon */}
                                            <div className="mb-4">
                                                {stack.icon}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                                                {stack.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                                {stack.description}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {stack.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`
                            px-2 py-1 text-xs rounded-full transition-all duration-300
                            ${isSelected
                                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                                : 'bg-gray-700/50 text-gray-300 group-hover:bg-gray-600/50'
                                                            }
                          `}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selection Overlay */}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Stack Info */}
                    {selectedStack && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 max-w-2xl mx-auto mt-12">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-4 text-blue-300">
                                    {stacks.find(s => s.id === selectedStack)?.title} Selected
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    Great choice! This stack includes everything you need to get started quickly.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <GenerateButton label="Customize Features" onClick={onNext} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="text-center mt-12">
                        <p className="text-gray-400 text-sm">
                            Not sure which stack to choose? All stacks come with authentication, Docker support, and deployment configs.
                        </p>
                    </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
