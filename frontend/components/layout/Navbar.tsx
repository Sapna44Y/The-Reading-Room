"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.books, label: "Books" },
];

/** Mobile-only top bar — the Sidebar carries navigation at md+ (see AppShell). */
export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-foreground/10 bg-background md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={ROUTES.dashboard} className="flex items-center gap-2">
          <span className="ring-pink-sweep flex h-7 w-7 items-center justify-center text-accent">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="font-serif text-base font-semibold text-foreground">
            The Reading Room
          </span>
        </Link>
        {user && (
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="rounded-md p-1.5 text-foreground/50 transition-colors duration-300 hover:bg-foreground/8 hover:text-accent"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <nav className="flex items-center gap-1 px-4 pb-2.5">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors duration-300",
                isActive
                  ? "bg-accent/8 text-accent"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
