'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export function useOtpFlow(onSuccess: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [otpStep, setOtpStep] = useState<'email' | 'otp' | 'success'>('email');
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);

  // Countdown timer for code resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const sendOtp = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: {
          shouldCreateUser: false, // Ensure only pre-added users can request codes
        },
      });

      if (error) {
        // Typically throws if user doesn't exist under shouldCreateUser: false
        setErrorMsg('Email not authorized');
        toast.error('Email not authorized');
        setIsSubmitting(false);
        return;
      }

      setOtpStep('otp');
      setCountdown(30);
      setDigits(Array(6).fill(''));
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send verification code');
      toast.error('Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    await sendOtp(email);
  };

  const verifyOtp = useCallback(async (otpDigits: string[]) => {
    const code = otpDigits.join('');
    if (code.length !== 6) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setShouldShake(false);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (error) {
        setShouldShake(true);
        setErrorMsg('Incorrect code, please try again');
        toast.error('Incorrect code, please try again');
        setDigits(Array(6).fill(''));
        setIsSubmitting(false);
        // Clear shake status after animation finishes
        setTimeout(() => setShouldShake(false), 400);
        return;
      }

      setOtpStep('success');
      toast.success('Access Granted!');
      setTimeout(() => {
        onSuccess();
      }, 600);
    } catch (err) {
      console.error(err);
      setShouldShake(true);
      setErrorMsg('Verification failed');
      setTimeout(() => setShouldShake(false), 400);
      setIsSubmitting(false);
    }
  }, [email, onSuccess]);

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    // Auto-advance
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit on filling 6th digit
    if (newDigits.every((d) => d !== '') && newDigits.join('').length === 6) {
      verifyOtp(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits];
      if (!digits[index] && index > 0) {
        newDigits[index - 1] = '';
        setDigits(newDigits);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      } else {
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasteData[i] ?? '';
      }
      setDigits(newDigits);

      // Focus last pasted or next empty
      const focusIndex = Math.min(pasteData.length, 5);
      const nextInput = document.getElementById(`otp-input-${focusIndex}`);
      nextInput?.focus();

      if (pasteData.length === 6) {
        verifyOtp(newDigits);
      }
    }
  };

  const loginWithPassword = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    setShouldShake(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setShouldShake(true);
        setErrorMsg('Invalid email or password');
        toast.error('Invalid email or password');
        setIsSubmitting(false);
        setTimeout(() => setShouldShake(false), 400);
        return;
      }

      setOtpStep('success');
      toast.success('Access Granted!');
      setTimeout(() => {
        onSuccess();
      }, 600);
    } catch (err) {
      console.error(err);
      setShouldShake(true);
      setErrorMsg('Login failed');
      setTimeout(() => setShouldShake(false), 400);
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setEmail('');
    setPassword('');
    setIsPasswordMode(false);
    setOtpStep('email');
    setDigits(Array(6).fill(''));
    setErrorMsg(null);
    setShouldShake(false);
    setIsSubmitting(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isPasswordMode,
    setIsPasswordMode,
    otpStep,
    setOtpStep,
    digits,
    countdown,
    isSubmitting,
    errorMsg,
    shouldShake,
    sendOtp,
    resendOtp,
    verifyOtp: () => verifyOtp(digits),
    loginWithPassword,
    handleDigitChange,
    handleKeyDown,
    handlePaste,
    resetFlow,
  };
}
