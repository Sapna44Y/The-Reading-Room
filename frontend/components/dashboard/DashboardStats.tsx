import { Library } from "lucide-react";
import { STATUS_CONFIG } from "@/constants/status";
import type { DashboardStats as DashboardStatsType } from "@/types/book";

export function DashboardStats({ stats }: { stats: DashboardStatsType }) {
  const tiles = [
    { label: "Total Books", value: stats.totalBooks, icon: Library },
    {
      label: STATUS_CONFIG.want_to_read.label,
      value: stats.wantToRead,
      icon: STATUS_CONFIG.want_to_read.icon,
    },
    {
      label: STATUS_CONFIG.reading.label,
      value: stats.reading,
      icon: STATUS_CONFIG.reading.icon,
    },
    {
      label: STATUS_CONFIG.completed.label,
      value: stats.completed,
      icon: STATUS_CONFIG.completed.icon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tiles.map((tile, index) => (
        <div
          key={tile.label}
          style={{ animationDelay: `${index * 60}ms` }}
          className="shelf-card animate-rise flex flex-col items-center gap-2 rounded-lg border border-foreground/12 bg-background p-4 text-center"
        >
          <span
            className="shelf-card-icon flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 text-foreground/45"
            aria-hidden="true"
          >
            <tile.icon className="h-5 w-5" />
          </span>
          <p className="font-serif text-2xl font-semibold text-foreground">
            {tile.value}
          </p>
          <p className="text-xs tracking-wide text-foreground/50 uppercase">
            {tile.label}
          </p>
        </div>
      ))}
    </div>
  );
}
