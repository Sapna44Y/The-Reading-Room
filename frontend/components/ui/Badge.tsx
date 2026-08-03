import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-foreground/15 bg-foreground/5 px-2 py-0.5 text-xs font-medium tracking-wide text-foreground/70 transition-colors duration-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
