import { motion } from "framer-motion";

export default function ErrorMessage({ headline, description }) {
  return (
    <motion.div
      className="text-center md:text-left"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
        {headline}
      </h1>
      <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
        {description}
      </p>
    </motion.div>
  );
}
