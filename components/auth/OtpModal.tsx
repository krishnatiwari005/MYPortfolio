'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useOtpFlow } from '@/hooks/useOtpFlow';
import Button from '../ui/button';
import Input from '../ui/input';
import { cn } from '@/lib/utils';

export interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OtpModal = ({ isOpen, onClose, onSuccess }: OtpModalProps) => {
  const {
    email,
    setEmail,
    otpStep,
    digits,
    countdown,
    isSubmitting,
    errorMsg,
    shouldShake,
    sendOtp,
    resendOtp,
    verifyOtp,
    handleDigitChange,
    handleKeyDown,
    handlePaste,
    resetFlow,
  } = useOtpFlow(onSuccess);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first OTP input on step 2 load
  useEffect(() => {
    if (otpStep === 'otp') {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [otpStep]);

  // Handle ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && otpStep === 'email') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [otpStep, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      resetFlow();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => otpStep === 'email' && onClose()} />

      {/* Modal Card */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="relative w-full max-w-[400px] bg-white rounded-3xl p-8 shadow-float z-10 overflow-hidden"
        >
          {otpStep === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="p-3 bg-accent-light text-accent-primary rounded-full">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Admin Access</h2>
                <p className="text-sm text-text-tertiary mt-1">
                  Enter your email to receive a 6-digit code
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendOtp(email)}
                    disabled={isSubmitting}
                    className="text-center font-medium"
                  />
                </div>

                <Button
                  onClick={() => sendOtp(email)}
                  disabled={isSubmitting || !email}
                  className="w-full justify-center"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code →'}
                </Button>
              </div>
            </motion.div>
          )}

          {otpStep === 'otp' && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Back Arrow */}
              <button
                onClick={() => resetFlow()}
                className="absolute top-6 left-6 text-text-tertiary hover:text-text-primary p-1.5 rounded-full hover:bg-border-subtle transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="pt-4">
                <h2 className="text-xl font-bold font-display text-text-primary">Check your inbox</h2>
                <p className="text-sm text-text-tertiary mt-1">We sent a 6-digit code to {email}</p>
              </div>

              {/* Digits row */}
              <motion.div
                animate={shouldShake ? { x: [0, 10, -10, 10, -10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex justify-center gap-2 py-4"
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    ref={index === 0 ? firstInputRef : null}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isSubmitting}
                    className={cn(
                      'w-12 h-14 border rounded-xl text-center text-2xl font-bold text-text-primary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary focus:bg-white transition-all',
                      errorMsg ? 'border-error' : 'border-border-default'
                    )}
                  />
                ))}
              </motion.div>

              {errorMsg && <p className="text-xs font-semibold text-error mt-1">{errorMsg}</p>}

              <Button
                onClick={verifyOtp}
                disabled={isSubmitting || digits.some((d) => d === '')}
                className="w-full justify-center mt-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify →'}
              </Button>

              {/* Resend timer */}
              <div className="text-xs text-text-tertiary pt-2">
                Didn&apos;t receive it?{' '}
                {countdown > 0 ? (
                  <span className="font-semibold text-text-secondary">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={resendOtp}
                    className="font-semibold text-accent-primary hover:text-accent-hover cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {otpStep === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center"
              >
                <Check className="w-8 h-8 stroke-[3]" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Welcome back!</h2>
                <p className="text-sm text-text-tertiary mt-1">Initializing Admin Dashboard...</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OtpModal;
