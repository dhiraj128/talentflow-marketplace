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
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: () => authService.register({
      email: email,
      phoneNumber: phone ? `${countryCode}${phone}` : undefined,
      verificationMethod: 'EMAIL',
      password: password,
      role: role,
      fullName: fullName
    }),
    onSuccess: async (createdUser: any) => {
      setErrorMsg(null);
      toast.success("Account created successfully!");
      try {
        const loginRes = await authService.login({ email, password });
        login(loginRes.access_token, loginRes.refresh_token, loginRes.user);
        const userRole = String(loginRes?.user?.role || createdUser?.role || role).toUpperCase();
        if (userRole === 'ADMIN') window.location.href = '/admin/dashboard';
        else if (userRole === 'EMPLOYER') window.location.href = '/employer/dashboard';
        else if (userRole === 'FREELANCER') window.location.href = '/freelancer/dashboard';
        else if (userRole === 'TRAINER') window.location.href = '/trainer/dashboard';
        else window.location.href = '/job-seeker/dashboard';
      } catch (err) {
        window.location.href = '/sign-in';
      }
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  // Navigation handlers
  const handleNextStep1 = () => setStep(2);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
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
            onClick={() => { setErrorMsg(null); setStep(1); }}
            className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Roles
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

          {/* STEP 2: DIRECT REGISTRATION FORM */}
          {step === 2 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1 text-center mb-4">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Complete Profile</h2>
                <p className="text-slate-400 text-sm">Create your {ROLES.find(r => r.id === role)?.label} account</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-[#1A2942] border-[#22344F]"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-[#1A2942] border-[#22344F]"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Create Password</Label>
                  <PasswordInput 
                    placeholder="Create a strong password (min 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <PasswordInput 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 bg-[#1A2942] border-[#22344F] text-black dark:text-white"
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
