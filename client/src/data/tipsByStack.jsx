import {
    FolderOpen,
    Terminal,
    Play,
    FileText,
    Globe,
    Server,
    Database,
    Smartphone,
    Layers,
    Coffee,
    Code,
    Zap
} from 'lucide-react';

const commonIcons = {
    unzip: <FolderOpen className="w-5 h-5" />,
    install: <Terminal className="w-5 h-5" />,
    run: <Play className="w-5 h-5" />,
    browser: <Globe className="w-5 h-5" />,
    code: <FileText className="w-5 h-5" />
};

export const tipsByStack = {
    mern: [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file to your desired location',
            command: null
        },
        {
            icon: commonIcons.install,
            title: 'Setup Server',
            description: 'Navigate to server folder and install dependencies',
            command: 'cd server && npm install'
        },
        {
            icon: commonIcons.run,
            title: 'Start Server',
            description: 'Start the Express backend',
            command: 'npm run dev'
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: 'Setup Client',
            description: 'Open a new terminal, go to client folder and install dependencies',
            command: 'cd client && npm install'
        },
        {
            icon: commonIcons.run,
            title: 'Start Client',
            description: 'Start the React frontend',
            command: 'npm run dev'
        }
    ],
    nextjs: [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: commonIcons.install,
            title: 'Install dependencies',
            description: 'Install the necessary packages',
            command: 'npm install'
        },
        {
            icon: commonIcons.run,
            title: 'Start dev server',
            description: 'Launch the Next.js development server',
            command: 'npm run dev'
        },
        {
            icon: commonIcons.browser,
            title: 'Open in Browser',
            description: 'Navigate to localhost:3000 to see your app',
            command: null
        }
    ],
    "node-express": [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: commonIcons.install,
            title: 'Install dependencies',
            description: 'Navigate to server folder and install dependencies',
            command: 'cd server && npm install'
        },
        {
            icon: commonIcons.run,
            title: 'Start server',
            description: 'Start the Express server in development mode',
            command: 'npm run dev'
        },
        {
            icon: <Server className="w-5 h-5" />,
            title: 'Test API',
            description: 'Test your endpoints using Postman or curl',
            command: 'curl http://localhost:5000/api/health'
        }
    ],
    django: [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: <Terminal className="w-5 h-5" />,
            title: 'Create Virtual Env',
            description: 'Create a python virtual environment',
            command: 'python -m venv venv'
        },
        {
            icon: <Code className="w-5 h-5" />,
            title: 'Install dependencies',
            description: 'Activate venv (source venv/bin/activate) and install requirements',
            command: 'pip install -r requirements.txt'
        },
        {
            icon: <Database className="w-5 h-5" />,
            title: 'Run Migrations',
            description: 'Apply database migrations',
            command: 'python manage.py migrate'
        },
        {
            icon: commonIcons.run,
            title: 'Start server',
            description: 'Run the Django development server',
            command: 'python manage.py runserver'
        }
    ],
    "spring-boot": [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: <Coffee className="w-5 h-5" />,
            title: 'Build Project',
            description: 'Build the application using Maven',
            command: './mvnw clean install'
        },
        {
            icon: commonIcons.run,
            title: 'Run Application',
            description: 'Start the Spring Boot application',
            command: './mvnw spring-boot:run'
        },
        {
            icon: commonIcons.browser,
            title: 'Access App',
            description: 'Open your browser at localhost:8080',
            command: null
        }
    ],
    flask: [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: <Terminal className="w-5 h-5" />,
            title: 'Create Virtual Env',
            description: 'Create a python virtual environment',
            command: 'python -m venv venv'
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: 'Install requirements',
            description: 'Install Flask and other dependencies',
            command: 'pip install -r requirements.txt'
        },
        {
            icon: commonIcons.run,
            title: 'Start Server',
            description: 'Run the Flask application',
            command: 'python run.py'
        }
    ],
    "full-stack-ts": [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the project files',
            command: null
        },
        {
            icon: commonIcons.install,
            title: 'Setup Server',
            description: 'Navigate to server, install dependencies',
            command: 'cd server && npm install'
        },
        {
            icon: <Database className="w-5 h-5" />,
            title: 'Setup Database',
            description: 'Configure .env with your PostgreSQL credentials',
            command: null
        },
        {
            icon: commonIcons.run,
            title: 'Start Server',
            description: 'Start backend server',
            command: 'npm run dev'
        },
        {
            icon: commonIcons.install,
            title: 'Setup Client',
            description: 'In new terminal: Navigate to client, install dependencies',
            command: 'cd client && npm install'
        },
        {
            icon: commonIcons.run,
            title: 'Start Client',
            description: 'Start frontend dev server',
            command: 'npm run dev'
        }
    ],
    "react-native": [
        {
            icon: commonIcons.unzip,
            title: 'Unzip the folder',
            description: 'Extract the downloaded ZIP file',
            command: null
        },
        {
            icon: commonIcons.install,
            title: 'Install dependencies',
            description: 'Navigate to client folder and install dependencies',
            command: 'cd client && npm install'
        },
        {
            icon: <Smartphone className="w-5 h-5" />,
            title: 'Start Expo',
            description: 'Start the Expo development server',
            command: 'npx expo start'
        },
        {
            icon: <Code className="w-5 h-5" />,
            title: 'Run on Device',
            description: 'Scan the QR code with Expo Go or run on emulator',
            command: 'a (Android) or i (iOS)'
        }
    ]
};
