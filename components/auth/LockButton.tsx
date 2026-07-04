'use client';

import { motion } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LockButtonProps {
  isAdmin: boolean;
  panelOpen: boolean;
  onTogglePanel: () => void;
  onOpenLogin: () => void;
}

export const LockButton = ({
  isAdmin,
  panelOpen,
  onTogglePanel,
  onOpenLogin,
}: LockButtonProps) => {
  const handleClick = () => {
    if (isAdmin) {
      onTogglePanel();
    } else {
      onOpenLogin();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      // Animates positioning depending on whether the sidebar panel is open (panel width 480px + 24px gap = 504px)
      animate={{
        right: panelOpen ? 504 : 24,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      title={isAdmin ? 'Admin Active — click to open panel' : 'Admin Login'}
      className={cn(
        'fixed bottom-6 z-[150] flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
        isAdmin
          ? 'bg-accent-light border border-accent-primary text-accent-primary opacity-100'
          : 'glass-card text-text-secondary opacity-60 hover:opacity-100'
      )}
    >
      {isAdmin ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
    </motion.button>
  );
};

export default LockButton;
