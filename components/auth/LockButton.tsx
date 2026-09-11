'use client';

import { motion } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LockButtonProps {
  isAdmin: boolean;
  onTogglePanel: () => void;
  onOpenLogin: () => void;
}

export const LockButton = ({
  isAdmin,
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
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      title={isAdmin ? 'Admin Active — click to open panel' : 'Admin Login'}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
        isAdmin
          ? 'bg-[#00e5ff] border border-[#00e5ff] text-[#001a33] opacity-100 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]'
          : 'bg-[#001a33] border border-[#00e5ff]/30 text-[#00e5ff] opacity-60 hover:opacity-100 hover:border-[#00e5ff]/60 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]'
      )}
    >
      {isAdmin ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
    </motion.button>
  );
};

export default LockButton;
