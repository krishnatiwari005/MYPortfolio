'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bot, Terminal, Cpu } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
  name?: string;
}

const BOOT_LOGS = [
  'INITIALIZING SYSTEM KERNEL & AI CORE...',
  'LOADING NEURAL NETWORKS [||||||||||] 100%',
  'ESTABLISHING SECURE ENCRYPTED PROTOCOLS...',
  'CONNECTING PORTFOLIO REPOSITORIES & APIS...',
  'ACCESS GRANTED. SYSTEM OPTIMAL.',
  'LAUNCHING USER INTERFACE...'
];

export default function WelcomeScreen({ onComplete, name }: WelcomeScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  
  const firstName = name ? name.trim().split(' ')[0] : 'Krishna';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Progress interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 14) + 4;
      });
    }, 150);

    // Boot logs interval
    const logInterval = setInterval(() => {
      setLogIndex((prev) => Math.min(prev + 1, BOOT_LOGS.length - 1));
    }, 380);

    let innerTimer: NodeJS.Timeout;
    const timer = setTimeout(() => {
      clearInterval(interval);
      clearInterval(logInterval);
      setProgress(100);
      innerTimer = setTimeout(() => {
        document.body.style.overflow = 'auto';
        onComplete();
      }, 500);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000d1a] text-[#e0f7fa] overflow-hidden px-4 select-none"
    >
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}
      />
      
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-sky-500/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        
        {/* Top Title: Welcome to Krishna's Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 flex flex-col items-center text-center gap-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.15)] text-xs font-mono tracking-widest text-cyan-300 uppercase">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Developer & Full Stack Engineer</span>
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-cyan-400 drop-shadow-[0_0_30px_rgba(0,229,255,0.5)]">
            Welcome to {firstName}&apos;s Portfolio
          </h1>
        </motion.div>

        {/* Futuristic Robot Agent HUD Ring */}
        <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
          {/* Outer dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
          />
          {/* Middle dotted ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2.5 rounded-full border-2 border-dotted border-sky-400/50"
          />
          {/* Solid glowing ring */}
          <motion.div
            animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-5 rounded-full border border-cyan-300/40 shadow-[0_0_25px_rgba(0,229,255,0.3)] bg-cyan-950/40 backdrop-blur-sm"
          />
          
          {/* Robot Agent Avatar */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.5)] bg-[#001f3f] flex items-center justify-center">
              {!imgError ? (
                <img
                  src="/krisnova-avatar.jpg"
                  alt="KrisNova AI"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Bot className="w-10 h-10 text-cyan-300" />
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
                KrisNova AI
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Boot Text Block (No Emojis, Clean Monospace) */}
        <div className="w-full max-w-lg h-28 font-mono text-xs sm:text-sm text-cyan-400/90 mb-6 flex flex-col items-center justify-end overflow-hidden px-4">
          <AnimatePresence mode="popLayout">
            {BOOT_LOGS.slice(0, logIndex + 1).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full text-center tracking-wide py-0.5 truncate"
              >
                <span className="text-sky-300 font-bold mr-2">{'>'}</span> 
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tech Sci-Fi Progress Bar */}
        <div className="w-full max-w-md flex flex-col items-stretch gap-2 px-4">
          <div className="flex justify-between w-full text-xs text-cyan-500/80 font-mono tracking-widest uppercase mb-1">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              SYS.INITIALIZING
            </span>
            <span className="text-cyan-300 font-semibold">{Math.min(progress, 100)}%</span>
          </div>
          
          <div className="relative w-full h-[4px] bg-cyan-950/80 border border-cyan-500/20 rounded-full overflow-hidden shadow-inner">
            {/* Progress fill */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-sky-300 to-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.9)]"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.12 }}
            />
          </div>
          
          {/* Decorative scanner line */}
          <div className="relative w-full h-[1px] mt-1 bg-transparent overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
