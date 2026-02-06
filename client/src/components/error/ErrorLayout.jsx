import { motion } from "framer-motion";

export default function ErrorLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-900" />

      {/* Subtle neon glow accents */}
      <div className="absolute -top-56 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl opacity-70" />
      <div className="absolute -bottom-56 right-1/2 h-[460px] w-[460px] translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-cyan-500/15 blur-3xl opacity-60" />

      <motion.div
        className="relative z-10 min-h-screen flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
