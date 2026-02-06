import { motion } from "framer-motion";

export default function ErrorIllustration({ src, alt }) {
  return (
    <motion.div
      className="w-full max-w-md mx-auto h-[240px] sm:h-[300px] md:h-[360px] flex items-center justify-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.img
        src={src}
        alt={alt}
        draggable="false"
        className="w-full h-full object-contain"
        animate={{ y: [0, -10, 0], opacity: [0.95, 1, 0.95] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
