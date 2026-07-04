import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './button';

export interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  body: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  heading,
  body,
  actionText,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-default rounded-2xl bg-white/40 backdrop-blur-sm max-w-md mx-auto my-6">
      <div className="p-3 bg-accent-light text-accent-primary rounded-2xl mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold font-display text-text-primary mb-1">{heading}</h3>
      <p className="text-sm text-text-tertiary mb-5 max-w-xs leading-relaxed">{body}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
