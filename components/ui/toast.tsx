'use client';

import * as React from 'react';
import { toast as hotToast, Toast } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomToastProps {
  t: Toast;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const CustomToast = ({ t, type, message, actionText, onAction }: CustomToastProps) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return { bar: 'bg-success', text: 'text-success', icon: CheckCircle2 };
      case 'error':
        return { bar: 'bg-error', text: 'text-error', icon: AlertCircle };
      case 'warning':
        return { bar: 'bg-amber-500', text: 'text-amber-500', icon: AlertTriangle };
      case 'info':
        return { bar: 'bg-accent-primary', text: 'text-accent-primary', icon: Info };
    }
  };

  const colors = getColors();
  const Icon = colors.icon;

  return (
    <div
      className={cn(
        'relative flex items-center justify-between min-w-[320px] max-w-[450px] rounded-xl glass-card overflow-hidden transition-all duration-300 border-l-[4px] py-4 px-4 pr-6 shadow-float',
        type === 'success' && 'border-l-success',
        type === 'error' && 'border-l-error',
        type === 'warning' && 'border-l-amber-500',
        type === 'info' && 'border-l-accent-primary',
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn('w-5 h-5 shrink-0', colors.text)} />
        <p className="text-sm font-medium text-text-secondary leading-tight">{message}</p>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {actionText && onAction && (
          <button
            onClick={() => {
              onAction();
              hotToast.dismiss(t.id);
            }}
            className="text-xs font-semibold text-accent-primary hover:text-accent-hover underline cursor-pointer"
          >
            {actionText}
          </button>
        )}
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="text-text-tertiary hover:text-text-primary p-0.5 rounded-full hover:bg-border-subtle cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const toast = {
  success: (message: string, options?: { actionText?: string; onAction?: () => void }) => {
    hotToast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="success"
          message={message}
          actionText={options?.actionText}
          onAction={options?.onAction}
        />
      ),
      { duration: 4000 }
    );
  },
  error: (message: string, options?: { actionText?: string; onAction?: () => void }) => {
    hotToast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="error"
          message={message}
          actionText={options?.actionText}
          onAction={options?.onAction}
        />
      ),
      { duration: 6000 }
    );
  },
  warning: (message: string, options?: { actionText?: string; onAction?: () => void }) => {
    hotToast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="warning"
          message={message}
          actionText={options?.actionText}
          onAction={options?.onAction}
        />
      ),
      { duration: 4000 }
    );
  },
  info: (message: string, options?: { actionText?: string; onAction?: () => void }) => {
    hotToast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="info"
          message={message}
          actionText={options?.actionText}
          onAction={options?.onAction}
        />
      ),
      { duration: 4000 }
    );
  },
};

export default toast;
