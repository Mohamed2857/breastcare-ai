import * as React from "react";
import { cn } from "@/lib/utils";

const make = (name, base, Tag) => {
  const C = React.forwardRef(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(base, className)} {...props} />
  ));
  C.displayName = name;
  return C;
};
export const Table = ({ className, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
);
export const TableHeader = make("TableHeader", "[&_tr]:border-b", "thead");
export const TableBody = make("TableBody", "[&_tr:last-child]:border-0", "tbody");
export const TableRow = make("TableRow", "border-b transition-colors hover:bg-muted/50", "tr");
export const TableHead = make("TableHead", "h-10 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap", "th");
export const TableCell = make("TableCell", "px-3 py-3 align-middle", "td");
