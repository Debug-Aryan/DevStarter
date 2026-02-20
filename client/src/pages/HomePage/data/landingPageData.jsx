import { Code, Database, Shield, Settings, FileText, Rocket } from 'lucide-react';

export const features = [
    {
        icon: <Code className="w-8 h-8" />,
        title: "Multiple Tech Stacks",
        description: "Choose from MERN, Next.js, Node.js, Django, Spring Boot, Flask, and more."
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Authentication Ready",
        description: "Pre-configured authentication flows including JWT and secure middleware."
    },
    {
        icon: <Settings className="w-8 h-8" />,
        title: "Production Tooling",
        description: "Docker support, environment configs, and clean setup for real-world projects."
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: "Clear Documentation",
        description: "Auto-generated README files with setup, structure, and usage instructions."
    },
    {
        icon: <Database className="w-8 h-8" />,
        title: "Clean Architecture",
        description: "Well-organized folder structures following industry best practices."
    },
    {
        icon: <Rocket className="w-8 h-8" />,
        title: "Deploy Ready",
        description: "Deployment configurations included for platforms like Vercel and Render."
    }
];

export const steps = [
    {
        number: "1",
        title: "Select a Tech Stack",
        description: "Choose a backend, frontend, or full-stack setup that fits your project needs."
    },
    {
        number: "2",
        title: "Configure Features",
        description: "Enable authentication, Docker support, environment setup, and more."
    },
    {
        number: "3",
        title: "Generate & Build",
        description: "Download your project boilerplate and start building immediately."
    }
];

