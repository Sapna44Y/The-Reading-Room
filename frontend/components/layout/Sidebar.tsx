"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Library, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.books, label: "Books", icon: Library },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-foreground/10 bg-foreground/3 md:flex">
      <div className="flex flex-1 flex-col gap-8 p-6">
        <Link href={ROUTES.dashboard} className="flex items-center gap-2.5">
          <span className="ring-pink-sweep flex h-8 w-8 items-center justify-center text-accent">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold text-foreground">
            The Reading Room
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "border-accent bg-accent/8 text-accent"
                    : "border-transparent text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="flex items-center justify-between gap-2 border-t border-foreground/10 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-foreground/50">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="shrink-0 rounded-md p-1.5 text-foreground/50 transition-colors duration-300 hover:bg-foreground/8 hover:text-accent"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </aside>
  );
}
