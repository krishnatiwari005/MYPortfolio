'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'accent-light' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            // Variants
            'bg-gradient-to-r from-accent-primary to-[#7C3AED] text-white hover:opacity-95 shadow-md': variant === 'primary',
            'bg-white text-text-primary border border-border-default hover:bg-bg-primary shadow-sm': variant === 'secondary',
            'bg-accent-light text-accent-primary hover:bg-accent-primary/10': variant === 'accent-light',
            'text-text-secondary hover:bg-border-subtle hover:text-text-primary': variant === 'ghost',
            'bg-error text-white hover:bg-error/90 shadow-sm': variant === 'danger',
            // Sizes
            'text-xs py-2 px-3': size === 'sm',
            'text-sm py-2.5 px-5': size === 'md',
            'text-base py-3 px-6': size === 'lg',
            'p-2 rounded-full': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;
