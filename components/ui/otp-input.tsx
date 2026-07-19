'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import { RefreshCw } from 'lucide-react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  resendCooldown?: number;
}

export function OtpInput({
  length = 6,
  onComplete,
  onResend,
  resendCooldown = 60,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(resendCooldown);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // allow only 1 char
    setOtp(newOtp);

    // Auto advance
    if (index < length - 1) {
      setActiveOtpIndex(index + 1);
    }

    if (newOtp.every((v) => v !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        setActiveOtpIndex(index - 1);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text/plain')
      .slice(0, length)
      .split('');
    
    if (pastedData.length === 0) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    
    setOtp(newOtp);
    
    const nextIndex = Math.min(pastedData.length, length - 1);
    setActiveOtpIndex(nextIndex);
    
    if (newOtp.every((v) => v !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleResend = () => {
    if (cooldown > 0 || !onResend) return;
    setCooldown(resendCooldown);
    setOtp(new Array(length).fill(''));
    setActiveOtpIndex(0);
    onResend();
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="flex justify-between items-center w-full max-w-sm gap-2">
        {otp.map((_, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            ref={index === activeOtpIndex ? inputRef : null}
            value={otp[index]}
            onChange={(e) => handleOnChange(e, index)}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg transition-all",
              otp[index] ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300 dark:border-gray-700"
            )}
            onClick={() => setActiveOtpIndex(index)}
          />
        ))}
      </div>

      {onResend && (
        <div className="flex items-center text-sm">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-2",
              cooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"
            )}
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            <RefreshCw className={cn("w-4 h-4", cooldown > 0 && "animate-spin-slow")} />
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </Button>
        </div>
      )}
    </div>
  );
}
