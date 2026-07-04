import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'outline';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        {
          'bg-accent-primary text-white': variant === 'primary',
          'bg-bg-primary text-text-primary border border-border-default': variant === 'secondary',
          'bg-accent-light text-accent-primary': variant === 'accent',
          'bg-success/10 text-success': variant === 'success',
          'bg-error/10 text-error': variant === 'error',
          'border border-border-default text-text-secondary': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
};

export default Badge;
