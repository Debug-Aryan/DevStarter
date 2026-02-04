export default function CodePreviewSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-gray-900 px-6 py-24">
      
      {/* glow background */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[600px] h-[600px] bg-purple-600/20 blur-[160px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-5">
            Clean, Organized Structure
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            DevStarter generates scalable project architecture following real-world best practices.
          </p>
        </div>

        {/* code window */}
        <div className="relative group max-w-4xl mx-auto">

          {/* gradient border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-cyan-500/40 blur opacity-70 group-hover:opacity-100 transition" />

          <div className="relative bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">

            {/* terminal header */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="ml-4 text-gray-400 text-sm font-mono">project-structure</span>
            </div>

            {/* file tree */}
            <div className="font-mono text-sm leading-relaxed space-y-1">

              <div className="text-blue-400">📦 my-awesome-app/</div>

              <div className="ml-4 text-gray-300">├─ 📁 client/</div>
              <div className="ml-8 text-gray-400">├─ src/components/</div>
              <div className="ml-8 text-gray-400">├─ src/pages/</div>
              <div className="ml-8 text-gray-400">├─ src/routes/</div>
              <div className="ml-8 text-gray-400">└─ src/utils/</div>

              <div className="ml-4 text-gray-300 mt-2">├─ 📁 server/</div>
              <div className="ml-8 text-gray-400">├─ controllers/</div>
              <div className="ml-8 text-gray-400">├─ models/</div>
              <div className="ml-8 text-gray-400">├─ routes/</div>
              <div className="ml-8 text-gray-400">└─ middleware/</div>

              <div className="ml-4 text-gray-300 mt-2">├─ 🐳 docker-compose.yml</div>
              <div className="ml-4 text-gray-300">├─ 📄 README.md</div>
              <div className="ml-4 text-gray-300">├─ 📦 package.json</div>
              <div className="ml-4 text-gray-300">└─ 🔐 .env.example</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
