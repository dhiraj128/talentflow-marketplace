export function CourseOverview({ description }: { description: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">About This Course</h2>
      <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
        <p className="whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
}
