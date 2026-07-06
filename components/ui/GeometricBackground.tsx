'use client';

import { motion } from 'framer-motion';

export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f4fbfa]">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0f7f4]/50 via-transparent to-[#f0f4ff]/40" />

      {/* SVG Container for large arcs and rings */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Left Side Arcs */}
        <motion.circle
          cx="-10%"
          cy="40%"
          r="45%"
          fill="none"
          stroke="#e5ecf3"
          strokeWidth="100"
          className="opacity-30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.circle
          cx="-5%"
          cy="50%"
          r="30%"
          fill="none"
          stroke="#d2eaf4"
          strokeWidth="60"
          className="opacity-20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        />

        {/* Right Side Arcs */}
        <motion.circle
          cx="105%"
          cy="20%"
          r="35%"
          fill="none"
          stroke="#e0e7fb"
          strokeWidth="80"
          className="opacity-20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
        />
        <motion.circle
          cx="95%"
          cy="75%"
          r="25%"
          fill="none"
          stroke="#e6f5ef"
          strokeWidth="50"
          className="opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.3, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>

      {/* Floating Elements */}
      
      {/* Cyan Cube (Left) */}
      <motion.div
        className="absolute top-[25%] left-[8%] w-12 h-12 bg-gradient-to-br from-cyan-200 to-cyan-400 opacity-20"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          y: [0, -15, 0],
          rotateX: [15, 30, 15],
          rotateY: [45, 60, 45]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-white/30 skew-y-12 translate-y-[-25%] border border-cyan-100" />
      </motion.div>

      {/* Small Cyan Ring (Left) */}
      <motion.div
        className="absolute top-[40%] left-[18%] w-5 h-5 rounded-full border-4 border-cyan-300 opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Yellow Ring (Middle Left) */}
      <motion.div
        className="absolute top-[55%] left-[12%] w-6 h-6 rounded-full border-4 border-yellow-300 opacity-20"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Cyan Box Bottom Left */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] w-8 h-8 bg-emerald-300 opacity-20 rounded-sm"
        style={{ transform: 'rotate(45deg) skew(15deg, 15deg)' }}
        animate={{ y: [0, -8, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Star / Sparkle (Top Right) */}
      <motion.div
        className="absolute top-[20%] right-[12%] opacity-30"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400">
          <path d="M12 2v20m10-10H2m15.5 7.5L6.5 6.5m11 0L6.5 17.5" />
        </svg>
      </motion.div>

      {/* Purple Sparkle (Top Right below) */}
      <motion.div
        className="absolute top-[28%] right-[8%] w-4 h-4 text-purple-300 opacity-30"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </motion.div>

      {/* Blue Arrow (Bottom Right) */}
      <motion.div
        className="absolute bottom-[20%] right-[10%] opacity-30"
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-blue-400">
          <path d="M5 19L19 5M19 5v10m0-10H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 19L9 15M11 13L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
        </svg>
      </motion.div>

    </div>
  );
}
