import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function DemoVideoModal({ isOpen, onClose, videoId, triggerRect }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const fromTriggerOffset = useMemo(() => {
    if (!triggerRect) return { x: 0, y: 20 };

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    return {
      x: triggerCenterX - viewportCenterX,
      y: triggerCenterY - viewportCenterY,
    };
  }, [triggerRect]);

  const modalVariants = useMemo(() => {
    return {
      closed: (offset) => ({
        opacity: 0,
        x: offset?.x ?? 0,
        y: (offset?.y ?? 20) + 40,
        rotate: -10,
        scaleX: 0.22,
        scaleY: 0.06,
        filter: 'blur(18px)',
      }),
      open: {
        opacity: [0, 1, 1],
        x: [null, 0, 0],
        y: [null, -14, 0],
        rotate: [-10, 2, 0],
        scaleX: [0.22, 1.03, 1],
        scaleY: [0.06, 1.06, 1],
        filter: ['blur(18px)', 'blur(4px)', 'blur(0px)'],
        transition: {
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.72, 1],
        },
      },
      exit: (offset) => ({
        opacity: [1, 1, 0],
        x: [0, offset?.x ?? 0, offset?.x ?? 0],
        y: [0, (offset?.y ?? 20) + 20, (offset?.y ?? 20) + 40],
        rotate: [0, -6, -10],
        scaleX: [1, 0.32, 0.22],
        scaleY: [1, 0.22, 0.06],
        filter: ['blur(0px)', 'blur(10px)', 'blur(18px)'],
        transition: {
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.65, 1],
        },
      }),
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Moving blurred background accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
              initial={{ y: -10, opacity: 0.6 }}
              animate={{ y: [ -10, 20, -10 ], opacity: [ 0.55, 0.75, 0.55 ] }}
              transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
          </div>

          {/* Modal Container */}
          <motion.div
            style={{ transformOrigin: '50% 100%' }}
            custom={fromTriggerOffset}
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.85 }}
            className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 will-change-transform"
          >
            {/* Header/Close Bar (Optional visual touch) */}
            <div className="absolute top-0 right-0 z-10 p-4">
              <button
                onClick={onClose}
                data-no-loader="true"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
              </button>
            </div>

            {/* Video Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title="Demo Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );

}
