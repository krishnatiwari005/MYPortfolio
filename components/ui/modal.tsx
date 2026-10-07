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
  maxWidth?: string;
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
                className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            {/* Centered container — just for positioning */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className={cn(
                    'w-full bg-[#001a33] rounded-3xl relative shadow-float focus:outline-none',
                    'flex flex-col',
                    // Card is max 90% of viewport height — content scrolls inside
                    'max-h-[90vh]',
                    maxWidth
                  )}
                >
                  {/* ── Sticky Header ── */}
                  <div className="shrink-0 flex items-start justify-between px-8 pt-7 pb-3 border-b border-white/5">
                    <div>
                      {title && (
                        <DialogPrimitive.Title className="text-2xl font-bold font-display text-text-primary">
                          {title}
                        </DialogPrimitive.Title>
                      )}
                      {description && (
                        <DialogPrimitive.Description className="text-sm text-text-tertiary mt-1 leading-relaxed">
                          {description}
                        </DialogPrimitive.Description>
                      )}
                    </div>
                    <DialogPrimitive.Close
                      className="ml-4 mt-1 shrink-0 text-text-tertiary hover:text-text-primary p-2 rounded-full hover:bg-border-subtle transition-colors focus:outline-none cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                  </div>

                  {/* ── Scrollable Body ── */}
                  <div
                    className="flex-1 min-h-0 overflow-y-auto px-8 py-6"
                    style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                  >
                    {children}
                  </div>
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
