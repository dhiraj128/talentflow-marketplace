"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function LessonNotes({ lessonId }: { lessonId: string }) {
  const [note, setNote] = useState("");

  const handleSave = () => {
    // Save note
    console.log("Saving note for lesson:", lessonId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground">Your private notes for this lesson</h3>
      </div>
      <Textarea 
        placeholder="Type your notes here... They will automatically save and be available whenever you return to this lesson."
        className="min-h-[200px] resize-none bg-muted/20"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} size="sm" className="gap-2">
          <Save className="w-4 h-4" /> Save Notes
        </Button>
      </div>
    </div>
  );
}
