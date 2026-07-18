import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "PUBLISHED":
      case "VERIFIED":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      case "INACTIVE":
      case "ARCHIVED":
      case "CANCELLED":
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";
      case "PENDING":
      case "UNDER_REVIEW":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
      case "EXPIRED":
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
      default:
        return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10";
    }
  };

  const label = status.replace(/_/g, " ");

  return (
    <Badge variant="outline" className={cn("font-medium capitalize", getStatusStyles(), className)}>
      {label.toLowerCase()}
    </Badge>
  );
}
