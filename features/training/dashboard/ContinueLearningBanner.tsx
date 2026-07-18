import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

export function ContinueLearningBanner() {
  return (
    <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-none shadow-lg overflow-hidden mb-8 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      <CardContent className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-4 w-full">
          <div>
            <div className="text-blue-200 text-sm font-medium mb-1">CURRENTLY LEARNING</div>
            <h2 className="text-2xl md:text-3xl font-bold">Advanced React Patterns & Architecture</h2>
            <p className="text-blue-100/80 mt-1">Module 4: Server Components & Actions</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span>12/18 Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>~2h 15m remaining</span>
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-2 bg-white/20 [&>div]:bg-white" />
          </div>
        </div>
        
        <div className="w-full md:w-auto shrink-0 md:pl-6 md:border-l border-white/10 flex flex-col items-center">
          <Link href="/job-seeker/learning/react-adv" className="w-full">
            <Button size="lg" className="w-full bg-white text-blue-900 hover:bg-blue-50 font-semibold gap-2 h-14 md:h-12">
              <Play className="w-5 h-5 fill-current" /> Continue Learning
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
