"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { authService } from "@/lib/services/auth.service";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // First save tokens
      login(accessToken, refreshToken, null);

      // Then fetch user profile to complete login
      authService.getProfile()
        .then((res: any) => {
          login(accessToken, refreshToken, res);
          const role = res.role.toUpperCase();
          if (role === 'ADMIN') router.push('/admin/dashboard');
          else if (role === 'EMPLOYER') router.push('/employer/dashboard');
          else if (role === 'FREELANCER') router.push('/freelancer/dashboard');
          else if (role === 'TRAINER') router.push('/trainer/dashboard');
          else router.push('/job-seeker/dashboard');
        })
        .catch(() => {
          router.push("/sign-in?error=ProfileFetchFailed");
        });
    } else {
      router.push("/sign-in?error=MissingTokens");
    }
  }, [router, searchParams, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 animate-spin text-[#2563EB]" />
      <p className="mt-4 text-slate-300 font-medium">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-12 h-12 animate-spin text-[#2563EB]" /></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
