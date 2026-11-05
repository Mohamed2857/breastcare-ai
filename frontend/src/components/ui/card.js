import * as React from "react";
import { cn } from "@/lib/utils";

const make = (name, base, Tag = "div") => {
  const C = React.forwardRef(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(base, className)} {...props} />
  ));
  C.displayName = name;
  return C;
};
export const Card = make("Card", "rounded-lg border bg-card text-card-foreground shadow-sm");
export const CardHeader = make("CardHeader", "flex flex-col space-y-1.5 p-6");
export const CardTitle = make("CardTitle", "text-lg font-semibold leading-none tracking-tight", "h3");
export const CardDescription = make("CardDescription", "text-sm text-muted-foreground", "p");
export const CardContent = make("CardContent", "p-6 pt-0");
