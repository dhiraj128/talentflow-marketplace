import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | TalentFlow Marketplace",
    default: "TalentFlow Marketplace | Precision Talent System",
  },
  description: "A premier hiring and upskilling platform connecting top employers, elite candidates, and world-class educational academies.",
  keywords: ["hiring", "jobs", "academy", "talent", "recruitment"],
  openGraph: {
    title: "TalentFlow Marketplace",
    description: "Connect with elite talent and top employers.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} min-h-full flex flex-col font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
