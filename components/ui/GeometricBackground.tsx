'use client';

import { motion } from 'framer-motion';

// This component renders subtle cyber decorations only.
// The main dark background (#000d1a) comes from globals.css body styles.
// The Three.js animated canvas is rendered in AnimatedBackground.tsx (in layout.tsx).
export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle cyan glow orbs — complement the Three.js background */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.05) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,255,231,0.04) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* Subtle corner sparkle decorations */}
      <motion.div
        className="absolute top-[18%] right-[10%]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00e5ff]">
          <path d="M12 2v20m10-10H2m15.5 7.5L6.5 6.5m11 0L6.5 17.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[18%] left-[8%]"
        animate={{ x: [0, 8, 0], y: [0, -8, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[#00b4d8]">
          <path d="M5 19L19 5M19 5v10m0-10H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Small floating ring accents */}
      <motion.div
        className="absolute top-[38%] left-[15%] w-5 h-5 rounded-full border-2 border-[#00e5ff]"
        animate={{ y: [0, 10, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-[65%] right-[18%] w-4 h-4 rounded-full border-2 border-[#00ffe7]"
        animate={{ y: [0, -8, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    </div>
  );
}
