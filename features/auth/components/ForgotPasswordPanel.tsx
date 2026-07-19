"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OtpInput } from "@/components/ui/otp-input";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordPanel() {
  const router = useRouter();
  
  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mutations
  const forgotPasswordMutation = useMutation({
    mutationFn: () => authService.forgotPassword({ identifier }),
    onSuccess: (res: any) => {
      setErrorMsg(null);
      setStep(2);
      toast.success(`OTP sent to ${identifier}`);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to send OTP. Please check your identifier.');
    },
  });

  const method = identifier.includes('@') ? 'EMAIL' : 'PHONE';

  const resendOtpMutation = useMutation({
    mutationFn: () => authService.resendOtp({ identifier, purpose: 'FORGOT_PASSWORD', method }),
    onSuccess: () => {
      setErrorMsg(null);
      toast.success(`New OTP sent to ${identifier}`);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to resend OTP.');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => authService.resetPassword({ identifier, code: otp, newPassword }),
    onSuccess: () => {
      setErrorMsg(null);
      toast.success("Password reset successfully. You can now log in.");
      router.push('/sign-in');
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to reset password. Please try again.');
    },
  });

  // Handlers
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMsg("Please enter your email or mobile number.");
      return;
    }
    setErrorMsg(null);
    forgotPasswordMutation.mutate();
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="w-full flex-1 bg-[#081526] text-white flex flex-col justify-start items-center px-8 lg:px-12 py-4 xl:py-8 relative">
      <div className="w-full max-w-[480px] flex flex-col flex-1 overflow-hidden overflow-y-auto">
        
        <Link href="/sign-in" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        <div className="my-auto flex flex-col justify-center shrink-0 w-full py-4 mt-8 lg:mt-0">
          
          {/* STEP 1: ENTER IDENTIFIER */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Reset Password</h2>
                <p className="text-slate-400 text-sm">Enter your email or mobile number to receive an OTP</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <Label>Email or Mobile Number</Label>
                <Input 
                  type="text" 
                  placeholder="name@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12 bg-[#1A2942] border-[#22344F]"
                  autoFocus
                />
              </div>

              <Button 
                type="submit" 
                disabled={forgotPasswordMutation.isPending}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {forgotPasswordMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Verify OTP</h2>
                <p className="text-slate-400 text-sm">
                  We sent a 6-digit code to <span className="text-white font-medium">{identifier}</span>
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex justify-center items-center gap-2 text-sm text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <OtpInput 
                length={6} 
                onComplete={(code) => {
                  setOtp(code);
                  setStep(3); // move to password reset once OTP is entered
                }}
                onResend={() => resendOtpMutation.mutate()}
                resendCooldown={60}
              />
            </div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">New Password</h2>
                <p className="text-slate-400 text-sm">Secure your account with a new password</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <PasswordInput 
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <PasswordInput 
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
                    showStrengthIndicator={false}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={resetPasswordMutation.isPending}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 mt-2"
              >
                {resetPasswordMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
