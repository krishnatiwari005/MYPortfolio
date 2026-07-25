'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // useSpring provides perfectly smooth, hardware-accelerated movement that bypasses React re-renders
  // High stiffness and low mass ensure it stays perfectly aligned with the real mouse position
  const springConfig = { damping: 25, stiffness: 800, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      // Offset by 6px to perfectly center the 12px (w-3 h-3) dot on the actual mouse pointer
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      if (
        computedCursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customCursorPulse {
          0%, 100% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff; }
          50% { box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff; }
        }
        .animated-cursor-dot {
          animation: customCursorPulse 1.5s infinite ease-in-out;
        }
      `}} />
      
      {/* Main Animated Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#00ffff] rounded-full pointer-events-none z-[99999] animated-cursor-dot mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 400, damping: 25 },
          opacity: { duration: 0.2 }
        }}
      />
    </>
  );
};

export default CustomCursor;
