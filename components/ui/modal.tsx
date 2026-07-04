'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g., max-w-md, max-w-lg
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            {/* Container */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className={cn(
                    'w-full bg-white rounded-3xl p-8 relative shadow-float focus:outline-none overflow-hidden my-8',
                    maxWidth
                  )}
                >
                  {/* Close button */}
                  <DialogPrimitive.Close className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary p-2 rounded-full hover:bg-border-subtle transition-colors focus:outline-none cursor-pointer">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>

                  {title && (
                    <DialogPrimitive.Title className="text-2xl font-bold font-display text-text-primary mb-1">
                      {title}
                    </DialogPrimitive.Title>
                  )}

                  {description && (
                    <DialogPrimitive.Description className="text-sm text-text-tertiary mb-6 leading-relaxed">
                      {description}
                    </DialogPrimitive.Description>
                  )}

                  <div className="mt-2">{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </AnimatePresence>
  );
};

export default Modal;
