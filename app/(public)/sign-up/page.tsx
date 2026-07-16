import { BrandingPanel } from "@/features/auth/components/BrandingPanel";
import { SignUpPanel } from "@/features/auth/components/SignUpPanel";

export default function SignUpPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-[#081526]">
      <div className="w-full lg:w-[48%] hidden lg:flex flex-col border-r border-[#22344F]/50">
        <BrandingPanel />
      </div>
      <div className="w-full lg:w-[52%] flex flex-col">
        <SignUpPanel />
      </div>
    </div>
  );
}
