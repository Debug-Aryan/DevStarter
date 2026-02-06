import { motion } from "framer-motion";

function ActionButton({ variant = "primary", onClick, children, type = "button" }) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm sm:text-base font-semibold transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";

  const variants = {
    primary:
      "bg-[#161B22] border border-gray-700 hover:border-blue-500/50 hover:bg-[#1f2631]",
    secondary:
      "bg-transparent border border-gray-700 text-gray-200 hover:text-white hover:border-gray-500/70 hover:bg-white/5",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
    </motion.button>
  );
}

export default function ErrorActions({ onRetry, onGoHome, onLoginAgain, showLoginAgain }) {
  return (
    <motion.div
      className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <ActionButton variant="secondary" onClick={onGoHome}>
        Go Home
      </ActionButton>
    </motion.div>
  );
}
