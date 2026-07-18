import { PlayCircle } from "lucide-react";
import { LessonResources } from "./LessonResources";
import { LessonNotes } from "./LessonNotes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LessonContentProps {
  lesson: any;
  courseId: string;
}

export function LessonContent({ lesson, courseId }: LessonContentProps) {
  if (!lesson) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4">{lesson.title}</h1>
        
        {lesson.type === "video" ? (
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-border/50 flex items-center justify-center">
            {/* Mock Video Player */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop')] opacity-30 mix-blend-overlay bg-cover bg-center"></div>
            <div className="z-10 flex flex-col items-center">
              <button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors group">
                <PlayCircle className="w-8 h-8 text-white fill-white/20 group-hover:scale-110 transition-transform" />
              </button>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-black/50 text-white/90 text-sm font-medium backdrop-blur-md">
                Mock Video Player
              </div>
            </div>
            
            {/* Mock controls */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-3">
              <div className="w-full flex items-center gap-4 text-white">
                <PlayCircle className="w-5 h-5 shrink-0 cursor-pointer hover:text-blue-400" />
                <div className="text-xs font-medium shrink-0">01:24 / 15:42</div>
                <div className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border/60 p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2>Reading Material</h2>
            <p>This is a mock text-based lesson. In a real scenario, this would contain markdown or rich text content for the student to read.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 space-x-6">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3">Overview</TabsTrigger>
          <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3">Resources</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-2 py-3">My Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-0 outline-none">
          <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none text-muted-foreground">
            <p>In this lesson, we cover the fundamental concepts required to build scalable applications using modern architecture patterns. Pay close attention to the data flow mechanisms explained in the second half of the video.</p>
          </div>
        </TabsContent>
        <TabsContent value="resources" className="mt-0 outline-none">
          <LessonResources />
        </TabsContent>
        <TabsContent value="notes" className="mt-0 outline-none">
          <LessonNotes lessonId={lesson.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
