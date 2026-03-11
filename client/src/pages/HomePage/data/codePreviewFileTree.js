export const fileTree = [
  {
    name: "my-awesome-app/",
    icon: "📦",
    color: "text-blue-400",
    type: "root",
    children: [
      {
        name: "client/",
        icon: "📁",
        color: "text-yellow-400",
        type: "folder",
        children: [
          {
            name: "public/",
            icon: "📁",
            color: "text-yellow-300",
            type: "folder",
            children: [
              {
                name: "favicon.ico",
                icon: "🖼️",
                color: "text-gray-400",
                type: "file",
              },
              {
                name: "robots.txt",
                icon: "📄",
                color: "text-gray-400",
                type: "file",
              },
            ],
          },
          {
            name: "src/",
            icon: "📁",
            color: "text-yellow-300",
            type: "folder",
            children: [
              {
                name: "components/",
                icon: "⚛️",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "Button.tsx",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "Modal.tsx",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "Navbar.tsx",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "Sidebar.tsx",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                ],
              },
              {
                name: "pages/",
                icon: "📄",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "index.tsx",
                    icon: "🏠",
                    color: "text-green-400",
                    type: "file",
                  },
                  {
                    name: "about.tsx",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "dashboard.tsx",
                    icon: "📊",
                    color: "text-purple-400",
                    type: "file",
                  },
                  {
                    name: "settings.tsx",
                    icon: "⚙️",
                    color: "text-gray-400",
                    type: "file",
                  },
                ],
              },
              {
                name: "hooks/",
                icon: "🪝",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "useAuth.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "useFetch.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "useTheme.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                ],
              },
              {
                name: "store/",
                icon: "🗄️",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "authSlice.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "index.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                ],
              },
              {
                name: "utils/",
                icon: "🔧",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "api.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "helpers.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "validators.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                ],
              },
              {
                name: "styles/",
                icon: "🎨",
                color: "text-cyan-400",
                type: "folder",
                children: [
                  {
                    name: "globals.css",
                    icon: "🎨",
                    color: "text-pink-400",
                    type: "file",
                  },
                  {
                    name: "variables.css",
                    icon: "🎨",
                    color: "text-pink-400",
                    type: "file",
                  },
                ],
              },
              { name: "App.tsx", icon: "⚛️", color: "text-blue-400", type: "file" },
              { name: "main.tsx", icon: "🚀", color: "text-green-400", type: "file" },
            ],
          },
          { name: "index.html", icon: "🌐", color: "text-orange-400", type: "file" },
          { name: "vite.config.ts", icon: "⚡", color: "text-yellow-400", type: "file" },
          {
            name: "tailwind.config.ts",
            icon: "💨",
            color: "text-cyan-400",
            type: "file",
          },
          { name: "tsconfig.json", icon: "📘", color: "text-blue-400", type: "file" },
        ],
      },
      {
        name: "server/",
        icon: "📁",
        color: "text-yellow-400",
        type: "folder",
        children: [
          {
            name: "src/",
            icon: "📁",
            color: "text-yellow-300",
            type: "folder",
            children: [
              {
                name: "controllers/",
                icon: "🎮",
                color: "text-emerald-400",
                type: "folder",
                children: [
                  {
                    name: "authController.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "userController.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                  {
                    name: "dataController.ts",
                    icon: "📝",
                    color: "text-blue-300",
                    type: "file",
                  },
                ],
              },
              {
                name: "models/",
                icon: "🗂️",
                color: "text-emerald-400",
                type: "folder",
                children: [
                  { name: "User.ts", icon: "👤", color: "text-blue-300", type: "file" },
                  { name: "Post.ts", icon: "📝", color: "text-blue-300", type: "file" },
                  { name: "Comment.ts", icon: "💬", color: "text-blue-300", type: "file" },
                ],
              },
              {
                name: "routes/",
                icon: "🛣️",
                color: "text-emerald-400",
                type: "folder",
                children: [
                  { name: "auth.ts", icon: "🔐", color: "text-red-400", type: "file" },
                  { name: "users.ts", icon: "📝", color: "text-blue-300", type: "file" },
                  { name: "api.ts", icon: "📝", color: "text-blue-300", type: "file" },
                ],
              },
              {
                name: "middleware/",
                icon: "🔗",
                color: "text-emerald-400",
                type: "folder",
                children: [
                  { name: "auth.ts", icon: "🔐", color: "text-red-400", type: "file" },
                  {
                    name: "errorHandler.ts",
                    icon: "🚨",
                    color: "text-red-400",
                    type: "file",
                  },
                  {
                    name: "rateLimiter.ts",
                    icon: "⏱️",
                    color: "text-orange-400",
                    type: "file",
                  },
                  { name: "logger.ts", icon: "📋", color: "text-gray-400", type: "file" },
                ],
              },
              {
                name: "config/",
                icon: "⚙️",
                color: "text-emerald-400",
                type: "folder",
                children: [
                  {
                    name: "database.ts",
                    icon: "🗄️",
                    color: "text-purple-400",
                    type: "file",
                  },
                  { name: "env.ts", icon: "🔐", color: "text-red-400", type: "file" },
                ],
              },
              { name: "app.ts", icon: "🚀", color: "text-green-400", type: "file" },
              { name: "server.ts", icon: "🖥️", color: "text-blue-400", type: "file" },
            ],
          },
          { name: "tsconfig.json", icon: "📘", color: "text-blue-400", type: "file" },
        ],
      },
      {
        name: "shared/",
        icon: "📁",
        color: "text-yellow-400",
        type: "folder",
        children: [
          {
            name: "types/",
            icon: "📁",
            color: "text-yellow-300",
            type: "folder",
            children: [
              { name: "index.ts", icon: "📝", color: "text-blue-300", type: "file" },
              {
                name: "api.types.ts",
                icon: "📝",
                color: "text-blue-300",
                type: "file",
              },
            ],
          },
          {
            name: "constants/",
            icon: "📁",
            color: "text-yellow-300",
            type: "folder",
            children: [{ name: "index.ts", icon: "📝", color: "text-blue-300", type: "file" }],
          },
        ],
      },
      {
        name: "infra/",
        icon: "📁",
        color: "text-yellow-400",
        type: "folder",
        children: [
          { name: "nginx.conf", icon: "⚙️", color: "text-gray-400", type: "file" },
          { name: "Dockerfile.client", icon: "🐳", color: "text-blue-400", type: "file" },
          { name: "Dockerfile.server", icon: "🐳", color: "text-blue-400", type: "file" },
        ],
      },
      { name: "docker-compose.yml", icon: "🐳", color: "text-blue-400", type: "file" },
      {
        name: "docker-compose.prod.yml",
        icon: "🐳",
        color: "text-blue-500",
        type: "file",
      },
      { name: "README.md", icon: "📄", color: "text-gray-300", type: "file" },
      { name: "package.json", icon: "📦", color: "text-green-400", type: "file" },
      {
        name: "package-lock.json",
        icon: "🔒",
        color: "text-gray-500",
        type: "file",
      },
      {
        name: ".env.example",
        icon: "🔐",
        color: "text-yellow-300",
        type: "file",
      },
      { name: ".gitignore", icon: "🚫", color: "text-gray-500", type: "file" },
      { name: ".eslintrc.js", icon: "✅", color: "text-purple-400", type: "file" },
      {
        name: "prettier.config.js",
        icon: "✨",
        color: "text-pink-400",
        type: "file",
      },
    ],
  },
];

export default fileTree;
