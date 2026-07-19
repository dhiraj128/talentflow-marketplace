import { BrandingPanel } from "@/features/auth/components/BrandingPanel";
import { ForgotPasswordPanel } from "@/features/auth/components/ForgotPasswordPanel";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-[#081526]">
      <div className="w-full lg:w-[48%] hidden lg:flex flex-col border-r border-[#22344F]/50">
        <BrandingPanel />
      </div>
      <div className="w-full lg:w-[52%] flex flex-col">
        <ForgotPasswordPanel />
      </div>
    </div>
  );
}
