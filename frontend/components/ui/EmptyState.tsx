import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-foreground/20 py-16 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 text-foreground/35">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-serif text-base font-medium text-foreground">
          {title}
        </p>
        {description && (
          <p className="text-sm text-foreground/55">{description}</p>
        )}
      </div>
    </div>
  );
}
