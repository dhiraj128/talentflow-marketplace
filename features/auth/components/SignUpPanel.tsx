"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle, Lock
} from "lucide-react";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type SignUpValues = z.infer<typeof signUpSchema>;

const ROLES = [
  { id: 'CANDIDATE', label: 'Job Seeker', icon: Briefcase },
  { id: 'EMPLOYER', label: 'Employer', icon: Building },
  { id: 'FREELANCER', label: 'Freelancer', icon: MonitorPlay },
  { id: 'TRAINER', label: 'Trainer', icon: GraduationCap },
] as const;

export function SignUpPanel() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<string>('CANDIDATE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (data: SignUpValues) => authService.register({
      email: data.email,
      password: data.password,
      role: activeRole,
      fullName: data.fullName
    }),
    onSuccess: (res: any) => {
      setErrorMsg(null);
      // Option A: Automatically log the user in
      authService.login({ email: res.email, password: res.password }).then((loginRes) => {
         login(loginRes.access_token, loginRes.refresh_token, loginRes.user);
         const role = loginRes.user.role.toUpperCase();
         if (role === 'ADMIN') router.push('/admin/dashboard');
         else if (role === 'EMPLOYER') router.push('/employer/dashboard');
         else if (role === 'FREELANCER') router.push('/freelancer/dashboard');
         else if (role === 'TRAINER') router.push('/trainer/dashboard');
         else router.push('/job-seeker/dashboard');
      }).catch(err => {
         // Fallback to Option B
         router.push('/sign-in?registered=true');
      });
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  return (
    <div className="w-full flex-1 bg-[#081526] text-white flex flex-col justify-start items-center px-8 lg:px-12 py-4 xl:py-8 relative">
      <div className="w-full max-w-[560px] flex flex-col flex-1 overflow-hidden overflow-y-auto">
        
        <div className="my-auto flex flex-col justify-center shrink-0 w-full py-4">
          <div className="space-y-1 text-center mb-4 xl:mb-6 shrink-0">
            <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">Create an Account</h2>
            <p className="text-slate-400 text-xs xl:text-sm">Select your role and fill in your details</p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 mb-4 xl:mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {ROLES.map((role) => (
                <RoleCard 
                  key={role.id} 
                  role={role} 
                  isActive={activeRole === role.id} 
                  onClick={() => { setActiveRole(role.id); setErrorMsg(null); }} 
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit((d) => registerMutation.mutate({ ...d, password: d.password, email: d.email, fullName: d.fullName, confirmPassword: d.confirmPassword }))} className="flex flex-col gap-4 shrink-0">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-[16px] border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName" className="text-slate-300 text-sm font-semibold">Full Name / Company Name</Label>
              <Input 
                id="fullName" 
                type="text" 
                autoCapitalize="words" 
                {...register("fullName")} 
                className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
              />
              {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm font-semibold">Email</Label>
              <Input 
                id="email" 
                type="email" 
                autoCapitalize="none" 
                autoComplete="email" 
                {...register("email")} 
                className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-slate-300 text-sm font-semibold">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")} 
                  className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
                />
                {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-semibold">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  {...register("confirmPassword")} 
                  className="h-12 bg-[#0F1E33] border-[#22344F] text-white focus-visible:ring-[#2563EB] rounded-xl lg:rounded-[20px] placeholder:text-slate-500 transition-colors shadow-sm" 
                />
                {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-[52px] mt-2 text-base font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-blue-600 hover:to-blue-400 text-white rounded-xl lg:rounded-[20px] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-[1px] transition-all" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : `Sign Up`}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-slate-400 text-sm">Already have an account? </span>
            <Link href="/sign-in" className="text-[#2563EB] hover:text-blue-400 hover:underline font-medium transition-colors">Sign in</Link>
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 shrink-0 pb-4">
          {["256-bit SSL", "SOC 2 Ready", "GDPR Ready"].map(badge => (
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
      <span className="font-semibold text-[10px] leading-none whitespace-nowrap">{role.label}</span>
    </button>
  );
}
