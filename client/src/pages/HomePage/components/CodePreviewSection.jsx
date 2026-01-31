export default function CodePreviewSection() {
    return (
        <section className="relative z-10 px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Clean, Organized Structure</h2>
                    <p className="text-xl text-gray-400">Generated projects follow industry best practices</p>
                </div>

                <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8 max-w-4xl mx-auto">
                    <div className="font-mono text-sm space-y-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-400 text-sm ml-4 font-mono">terminal</span>
                        </div>
                        <div className="text-blue-400">📁 my-awesome-app/</div>
                        <div className="ml-4 text-gray-300">├── 📁 client/</div>
                        <div className="ml-8 text-gray-400">├── src/components/</div>
                        <div className="ml-8 text-gray-400">├── src/pages/</div>
                        <div className="ml-8 text-gray-400">└── src/utils/</div>
                        <div className="ml-4 text-gray-300">├── 📁 server/</div>
                        <div className="ml-8 text-gray-400">├── routes/</div>
                        <div className="ml-8 text-gray-400">├── models/</div>
                        <div className="ml-8 text-gray-400">└── middleware/</div>
                        <div className="ml-4 text-gray-300">├── 🐳 docker-compose.yml</div>
                        <div className="ml-4 text-gray-300">├── 📄 README.md</div>
                        <div className="ml-4 text-gray-300">└── 🔧 .env.example</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
