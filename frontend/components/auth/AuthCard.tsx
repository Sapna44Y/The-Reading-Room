import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface AuthCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="animate-rise w-full max-w-md rounded-xl border border-foreground/15 bg-background p-10 shadow-[0_20px_50px_-25px_rgba(5,31,32,0.28)]">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="ring-pink-sweep mb-4 flex h-14 w-14 items-center justify-center text-accent">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="heading heading-underline font-serif text-2xl font-semibold">
          {title}
        </h1>
        <p className="mt-3 text-sm text-foreground/55 italic">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
