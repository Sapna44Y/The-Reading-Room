import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, id, className, startAdornment, endAdornment, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold tracking-wide text-foreground/50 uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-foreground/35">
              {startAdornment}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              "w-full rounded-lg border border-foreground/20 bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-300 ease-out hover:border-foreground/30 focus:border-accent/55 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_14%,transparent)]",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              error && "border-red-400 hover:border-red-400",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute top-1/2 right-3.5 -translate-y-1/2">
              {endAdornment}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
