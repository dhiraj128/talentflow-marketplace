import { Check } from "lucide-react";

export function LearningOutcomes({ outcomes }: { outcomes: string[] }) {
  return (
    <div className="bg-muted/30 border border-border/60 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">What you'll learn</h2>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
        {outcomes.map((outcome, idx) => (
          <div key={idx} className="flex gap-3">
            <Check className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-sm text-foreground/90 leading-relaxed">{outcome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
