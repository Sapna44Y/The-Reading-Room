import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border bg-size-[160%_100%] bg-position-[0%_50%] px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-out hover:bg-position-[100%_50%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "border-accent bg-(image:--gradient-pink) text-foreground shadow-[0_6px_16px_-8px_rgba(185,77,119,0.28)] hover:shadow-[0_10px_22px_-8px_rgba(185,77,119,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_4px_10px_-6px_rgba(185,77,119,0.25)]",
        variant === "secondary" &&
          "border-foreground/18 bg-transparent text-foreground hover:border-accent/45 hover:bg-accent/6 hover:-translate-y-0.5",
        variant === "danger" &&
          "border-red-700 bg-red-600 text-white shadow-[0_6px_16px_-8px_rgba(185,28,28,0.45)] hover:bg-red-700 hover:shadow-[0_10px_22px_-8px_rgba(185,28,28,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}
