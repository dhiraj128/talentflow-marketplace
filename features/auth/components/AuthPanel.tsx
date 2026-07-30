"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { 
  Briefcase, Building, MonitorPlay, GraduationCap, Shield,
  AlertCircle, Globe, Mail, Lock
} from "lucide-react";

const signInSchema = z.object({
  email: z.string().min(3, "Please enter a valid email or phone number."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type SignInValues = z.infer<typeof signInSchema>;


const ROLES = [
  { id: 'job-seeker', label: 'Job Seeker', icon: Briefcase },
  { id: 'employer', label: 'Employer', icon: Building },
  { id: 'freelancer', label: 'Freelancer', icon: MonitorPlay },
  { id: 'trainer', label: 'Trainer', icon: GraduationCap },
  { id: 'admin', label: 'Administrator', icon: Shield },
] as const;

export function AuthPanel() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('job-seeker');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'ProfileFetchFailed') setErrorMsg('Failed to fetch user profile after OAuth login.');
      else if (errorParam === 'MissingTokens') setErrorMsg('OAuth login returned without tokens.');
      else if (errorParam === 'GoogleAuthFailed') setErrorMsg('Google login was cancelled or failed.');
      else setErrorMsg(errorParam);
    }
  }, [searchParams]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: SignInValues) => authService.login(data),
    onSuccess: (res: any) => {
      setErrorMsg(null);
      login(res.access_token, res.refresh_token, res.user);
      const role = String(res?.user?.role || '').toUpperCase();
      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'EMPLOYER') router.push('/employer/dashboard');
      else if (role === 'FREELANCER') router.push('/freelancer/dashboard');
      else if (role === 'TRAINER') router.push('/trainer/dashboard');
      else router.push('/job-seeker/dashboard');
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });

  return (
    <div className="w-full flex-1 bg-[#081526] text-white flex flex-col justify-start items-center px-8 lg:px-12 py-4 xl:py-8 relative">
      <div className="w-full max-w-[560px] flex flex-col flex-1 overflow-hidden">
        
        <div className="my-auto flex flex-col justify-center shrink-0 w-full py-4">
          {/* Header */}
          <div className="space-y-1 text-center mb-4 xl:mb-6 shrink-0">
            <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-slate-400 text-xs xl:text-sm">Select your role and sign in to continue</p>
          </div>

          {/* Role Selector Grid */}
          <div className="flex flex-col gap-1.5 shrink-0 mb-4 xl:mb-6">
            <div className="grid grid-cols-3 gap-2">
              {ROLES.slice(0, 3).map((role) => (
                <RoleCard 
                  key={role.id} 
                  role={role} 
                  isActive={activeTab === role.id} 
                  onClick={() => { setActiveTab(role.id as any); setErrorMsg(null); }} 
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.slice(3, 5).map((role) => (
                <RoleCard 
                  key={role.id} 
                  role={role} 
                  isActive={activeTab === role.id} 
                  onClick={() => { setActiveTab(role.id as any); setErrorMsg(null); }} 
                />
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="flex flex-col gap-4 shrink-0">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-[16px] border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm font-semibold">Email or Mobile Number</Label>
              <Input 
                id="email" 
                type="text" 
                placeholder="name@example.com or 9876543210"
                autoCapitalize="none" 
                autoComplete="email" 
                {...register("email")} 
                className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-sm font-semibold">Password</Label>
                <Link href="/forgot-password" className="text-xs text-[#2563EB] hover:text-blue-400 hover:underline font-medium transition-colors">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                {...register("password")} 
                className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-[52px] mt-2 text-base font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-blue-600 hover:to-blue-400 text-white rounded-xl lg:rounded-[20px] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-[1px] transition-all" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : `Sign In`}
            </Button>
          </form>

          {/* Social Login */}
          <div className="flex flex-col gap-3 xl:gap-4 shrink-0 mt-4 xl:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#22344F]" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-[#081526] px-4 text-slate-500">Or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 xl:gap-3">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.sispl.shop/api/v1'}/auth/google`} className="h-[44px] xl:h-[48px] bg-[#0F1E33] border border-[#22344F] text-slate-300 hover:bg-[#142640] hover:text-white rounded-xl lg:rounded-[20px] transition-colors shadow-sm flex items-center justify-center font-medium">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg> Google
              </a>
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.sispl.shop/api/v1'}/auth/github`} className="h-[44px] xl:h-[48px] bg-[#0F1E33] border border-[#22344F] text-slate-300 hover:bg-[#142640] hover:text-white rounded-xl lg:rounded-[20px] transition-colors shadow-sm flex items-center justify-center font-medium">
                <svg className="mr-2 h-4 w-4 fill-current text-slate-300" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg> GitHub
              </a>
            </div>
            <div className="mt-4 text-center">
              <span className="text-slate-400 text-sm">Don't have an account? </span>
              <Link href="/sign-up" className="text-[#2563EB] hover:text-blue-400 hover:underline font-medium transition-colors">Sign up</Link>
            </div>
          </div>

          {/* Verification Info - Ultra Compact */}
          <div className="bg-[#0F1E33]/40 border border-[#22344F] rounded-[16px] xl:rounded-[20px] p-3 xl:p-4 shrink-0 flex flex-col gap-1.5 xl:gap-2 mt-4 xl:mt-6 hover:border-[#2563EB]/30 transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#2563EB]" />
              <span className="font-semibold text-white text-sm">Identity Verification</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Upload ANY ONE government-issued identity document.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#22344F] text-slate-300 bg-[#081526]/50">Aadhaar</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#22344F] text-slate-300 bg-[#081526]/50">PAN</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#22344F] text-slate-300 bg-[#081526]/50">Passport</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#22344F] text-slate-300 bg-[#081526]/50">Driving Licence</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#22344F] text-slate-300 bg-[#081526]/50">Voter ID</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              One verified government-issued identity document is sufficient.
            </p>
          </div>
        </div>

        {/* Security Badges Footer - Bottom Aligned */}
        <div className="mt-auto pt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 shrink-0">
          {["256-bit SSL", "JWT Authentication", "Secure Payments", "SOC 2 Ready", "GDPR Ready"].map(badge => (
            <div key={badge} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              <Lock className="h-3 w-3" /> {badge}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function RoleCard({ role, isActive, onClick }: { role: typeof ROLES[number], isActive: boolean, onClick: () => void }) {
  const Icon = role.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-1 h-16 rounded-xl lg:rounded-[20px] border transition-all duration-200 outline-none
        ${isActive 
          ? "border-[#2563EB] bg-[#2563EB]/10 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)] ring-1 ring-[#2563EB]/50" 
          : "border-[#22344F] bg-[#0F1E33] text-slate-400 hover:border-[#2563EB]/40 hover:bg-[#142640] hover:text-slate-200 hover:-translate-y-[1px]"
        }
      `}
    >
      <Icon className={`h-4 w-4 ${isActive ? "text-[#2563EB]" : "text-slate-400"}`} />
      <span className="font-semibold text-xs leading-none text-center">{role.label}</span>
    </button>
  );
}
