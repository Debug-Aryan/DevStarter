import { Code, Database, Shield, Settings, FileText, Rocket } from 'lucide-react';

export const features = [
    {
        icon: <Code className="w-8 h-8" />,
        title: "Stack Selection",
        description: "Choose from MERN, Next.js, Node/Express, and more popular stacks"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Auth Ready",
        description: "JWT, OAuth, and authentication flows pre-configured"
    },
    {
        icon: <Settings className="w-8 h-8" />,
        title: "Docker + CI",
        description: "Containerized setup with GitHub Actions workflows"
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: "Auto README",
        description: "Generated documentation with setup instructions"
    },
    {
        icon: <Database className="w-8 h-8" />,
        title: "Clean Structure",
        description: "Organized folder structure following best practices"
    },
    {
        icon: <Rocket className="w-8 h-8" />,
        title: "Deploy-Ready",
        description: "One-click deployment configs for Vercel, Heroku, AWS"
    }
];

export const steps = [
    {
        number: "01",
        title: "Choose your stack",
        description: "Select from popular tech stacks like MERN, Next.js, or create your custom combo"
    },
    {
        number: "02",
        title: "Toggle your features",
        description: "Add authentication, Docker, database integration, and other essential features"
    },
    {
        number: "03",
        title: "Download & Start Coding",
        description: "Get your complete boilerplate and start building your app immediately"
    }
];

export const testimonials = [
    {
        name: "Alex Chen",
        role: "Full Stack Developer",
        avatar: "AC",
        quote: "Saved me hours every time I started a new project! The boilerplates are production-ready."
    },
    {
        name: "Sarah Kim",
        role: "Startup Founder",
        avatar: "SK",
        quote: "DevStarter helped me launch my MVP 3x faster. The auth setup alone saved me days."
    },
    {
        name: "Marcus Rodriguez",
        role: "Senior Engineer",
        avatar: "MR",
        quote: "Clean, well-structured code that follows industry best practices. Highly recommended!"
    }
];
