import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourseLevelBadge } from "../shared/CourseLevelBadge";

export function FeaturedCourses() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-amber-500" /> Top Certifications This Month
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden relative group border-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 transition-transform duration-700 group-hover:scale-105" />
          <CardContent className="p-8 relative z-10 flex flex-col h-full min-h-[300px]">
            <CourseLevelBadge level="Certificate" className="bg-white/20 text-white w-fit mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Cybersecurity Professional Certification</h3>
            <p className="text-white/80 line-clamp-2 max-w-md mb-8">
              Master threat analysis, security architecture, and cryptography. Prepare for CompTIA Security+.
            </p>
            <div className="mt-auto">
              <Link href="/find-courses/cybersecurity">
                <Button className="bg-white text-indigo-900 hover:bg-white/90 font-semibold shadow-xl">
                  Explore Course <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white overflow-hidden relative group border-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 transition-transform duration-700 group-hover:scale-105" />
          <CardContent className="p-8 relative z-10 flex flex-col h-full min-h-[300px]">
            <CourseLevelBadge level="Specialization" className="bg-white/20 text-white w-fit mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Data Science & Machine Learning</h3>
            <p className="text-white/80 line-clamp-2 max-w-md mb-8">
              Learn Python, SQL, and build predictive models using TensorFlow and PyTorch.
            </p>
            <div className="mt-auto">
              <Link href="/find-courses/data-science">
                <Button className="bg-white text-emerald-900 hover:bg-white/90 font-semibold shadow-xl">
                  Explore Course <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
