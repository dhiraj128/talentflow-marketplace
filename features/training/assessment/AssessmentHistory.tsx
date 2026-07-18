import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function AssessmentHistory() {
  const history = [
    { id: 1, title: "React Fundamentals", date: new Date("2026-09-15"), score: 92, status: "Passed" },
    { id: 2, title: "Advanced Hooks", date: new Date("2026-09-18"), score: 75, status: "Failed" },
    { id: 3, title: "Advanced Hooks (Retake)", date: new Date("2026-09-20"), score: 95, status: "Passed" },
  ];

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Assessment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{format(item.date, "MMM d, yyyy")}</TableCell>
              <TableCell>{item.score}%</TableCell>
              <TableCell>
                <Badge variant="outline" className={item.status === "Passed" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
