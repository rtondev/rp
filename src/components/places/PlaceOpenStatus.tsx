"use client";

import { Clock } from "@phosphor-icons/react";
import {
  getOpenStatus,
  hasOpeningHours,
  parseOpeningHours,
  type OpeningHours,
} from "@/lib/opening-hours";
import { cn } from "@/lib/cn";

interface PlaceOpenStatusProps {
  openingHours?: OpeningHours | null;
  className?: string;
  compact?: boolean;
}

export function PlaceOpenStatus({
  openingHours,
  className,
  compact = false,
}: PlaceOpenStatusProps) {
  const hours = parseOpeningHours(openingHours);
  if (!hasOpeningHours(hours)) return null;

  const status = getOpenStatus(hours);
  if (!status) return null;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5",
        compact ? "text-[11px]" : "text-xs",
        className,
      )}
    >
      <Clock size={compact ? 12 : 14} weight="duotone" className="shrink-0 text-muted" />
      <span
        className={cn(
          "shrink-0 font-semibold",
          status.isOpen ? "text-emerald-600" : "text-red-600",
        )}
      >
        {status.label}
      </span>
      {status.detail && (
        <span className="truncate text-muted">· {status.detail}</span>
      )}
    </div>
  );
}
