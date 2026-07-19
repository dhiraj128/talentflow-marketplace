"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OtpInput } from "@/components/ui/otp-input";
import { AlertCircle, ArrowLeft, Mail, Phone, Briefcase, Building, MonitorPlay, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { id: 'CANDIDATE', label: 'Job Seeker', icon: Briefcase },
  { id: 'EMPLOYER', label: 'Employer', icon: Building },
  { id: 'FREELANCER', label: 'Freelancer', icon: MonitorPlay },
  { id: 'TRAINER', label: 'Trainer', icon: GraduationCap },
] as const;

export function SignUpPanel() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<string>('CANDIDATE');
  const [method, setMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  
  // Form state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const identifier = method === 'EMAIL' ? email : phone;

  // Mutations
  const sendOtpMutation = useMutation({
    mutationFn: () => method === 'EMAIL' 
      ? authService.sendEmailOtp({ identifier: email, purpose: 'REGISTER' })
      : authService.sendPhoneOtp({ identifier: phone, purpose: 'REGISTER' }),
    onSuccess: () => {
      setErrorMsg(null);
      setStep(4);
      toast.success(`OTP sent to ${identifier}`);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to send OTP.');
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => authService.resendOtp({ identifier, purpose: 'REGISTER', method }),
    onSuccess: () => {
      setErrorMsg(null);
      toast.success(`New OTP sent to ${identifier}`);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to resend OTP.');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (code: string) => method === 'EMAIL'
      ? authService.verifyEmailOtp({ identifier: email, code, purpose: 'REGISTER' })
      : authService.verifyPhoneOtp({ identifier: phone, code, purpose: 'REGISTER' }),
    onSuccess: () => {
      setErrorMsg(null);
      setStep(5);
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Invalid OTP.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: () => authService.register({
      email: method === 'EMAIL' ? email : undefined,
      phoneNumber: method === 'PHONE' ? phone : undefined,
      countryCode: method === 'PHONE' ? countryCode : undefined,
      verificationMethod: method,
      password: password,
      role: role,
      fullName: fullName
    }),
    onSuccess: (res: any) => {
      setErrorMsg(null);
      login(res.access_token, res.refresh_token, res.user);
      toast.success("Account created successfully!");
      const userRole = res.user.role.toUpperCase();
      if (userRole === 'ADMIN') router.push('/admin/dashboard');
      else if (userRole === 'EMPLOYER') router.push('/employer/dashboard');
      else if (userRole === 'FREELANCER') router.push('/freelancer/dashboard');
      else if (userRole === 'TRAINER') router.push('/trainer/dashboard');
      else router.push('/job-seeker/dashboard');
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  // Navigation handlers
  const handleNextStep1 = () => setStep(2);
  const handleNextStep2 = (selectedMethod: 'EMAIL' | 'PHONE') => {
    setMethod(selectedMethod);
    setStep(3);
  };
  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (method === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (method === 'PHONE' && !/^\d{10}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    sendOtpMutation.mutate();
  };

  const handleNextStep5 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    registerMutation.mutate();
  };

  return (
    <div className="w-full flex-1 bg-[#081526] text-white flex flex-col justify-start items-center px-8 lg:px-12 py-4 xl:py-8 relative">
      <div className="w-full max-w-[480px] flex flex-col flex-1 overflow-hidden overflow-y-auto">
        
        {step > 1 && (
          <button 
            onClick={() => { setErrorMsg(null); setStep(step - 1); }}
            className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="my-auto flex flex-col justify-center shrink-0 w-full py-4 mt-8 lg:mt-0">
          
          {/* STEP 1: CHOOSE ROLE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Create an Account</h2>
                <p className="text-slate-400 text-sm">Select your role to get started</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        isActive 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                          : 'border-[#22344F] hover:border-slate-500 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="font-medium">{r.label}</span>
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleNextStep1} className="w-full h-12 text-lg mt-4 bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          )}

          {/* STEP 2: CHOOSE METHOD */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Verification Method</h2>
                <p className="text-slate-400 text-sm">How would you like to sign up?</p>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleNextStep2('EMAIL')}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-[#22344F] hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left"
                >
                  <div className="bg-[#22344F] p-3 rounded-full text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Continue with Email</h3>
                    <p className="text-slate-400 text-sm">We'll send a code to your email</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNextStep2('PHONE')}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-[#22344F] hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left"
                >
                  <div className="bg-[#22344F] p-3 rounded-full text-green-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Continue with Mobile</h3>
                    <p className="text-slate-400 text-sm">We'll send an SMS with a code</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENTER IDENTIFIER */}
          {step === 3 && (
            <form onSubmit={handleNextStep3} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
                  Enter your {method === 'EMAIL' ? 'Email' : 'Mobile Number'}
                </h2>
                <p className="text-slate-400 text-sm">You'll receive a 6-digit verification code</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {method === 'EMAIL' ? (
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F]"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 w-20 text-center bg-[#1A2942] border-[#22344F]"
                      placeholder="+91"
                    />
                    <Input 
                      type="tel" 
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 flex-1 bg-[#1A2942] border-[#22344F]"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={sendOtpMutation.isPending}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* STEP 4: ENTER OTP */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Verify Code</h2>
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
                  verifyOtpMutation.mutate(code);
                }}
                onResend={() => resendOtpMutation.mutate()}
                resendCooldown={60}
              />
              
              {verifyOtpMutation.isPending && <p className="text-sm text-blue-400 mt-4">Verifying...</p>}
            </div>
          )}

          {/* STEP 5: CREATE PASSWORD */}
          {step === 5 && (
            <form onSubmit={handleNextStep5} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Complete Profile</h2>
                <p className="text-slate-400 text-sm">Secure your account with a password</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Create Password</Label>
                  <PasswordInput 
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <PasswordInput 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
                    showStrengthIndicator={false}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={registerMutation.isPending}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 mt-2"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
