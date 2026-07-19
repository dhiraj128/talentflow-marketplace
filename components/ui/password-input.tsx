'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator = true, onChange, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Internal state if not controlled
    const [internalValue, setInternalValue] = useState('');
    const actualValue = (value !== undefined ? value : internalValue) as string;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalValue(e.target.value);
      if (onChange) onChange(e);
    };

    // Validation rules
    const rules = [
      { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
      { id: 'upper', label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
      { id: 'lower', label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
      { id: 'number', label: 'One number', test: (v: string) => /[0-9]/.test(v) },
      { id: 'special', label: 'One special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
    ];

    return (
      <div className="w-full space-y-3">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn("pr-10", className)}
            ref={ref}
            value={actualValue}
            onChange={handleChange}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>

        {showStrengthIndicator && (
          <div className="space-y-2 pt-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password must contain:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {rules.map((rule) => {
                const isValid = rule.test(actualValue || '');
                return (
                  <li
                    key={rule.id}
                    className={cn(
                      "flex items-center gap-1.5 transition-colors",
                      isValid ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {isValid ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    <span>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
