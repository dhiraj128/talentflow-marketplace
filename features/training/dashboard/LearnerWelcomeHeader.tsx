import { User, Compass, PlayCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LearnerWelcomeHeaderProps {
  name?: string;
  avatarUrl?: string;
}

export function LearnerWelcomeHeader({ name = "Learner" }: LearnerWelcomeHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}!</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Ready to continue your learning journey?
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link href="/find-courses" className="flex-1 md:flex-none">
          <Button variant="outline" className="w-full">
            <Compass className="w-4 h-4 mr-2" /> Browse Courses
          </Button>
        </Link>
        <Link href="/job-seeker/learning" className="flex-1 md:flex-none">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <PlayCircle className="w-4 h-4 mr-2" /> My Learning
          </Button>
        </Link>
      </div>
    </div>
  );
}
