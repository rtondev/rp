"use client";

import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  icon?: Icon;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition active:scale-[0.98]",
              active
                ? "border-accent bg-accent/10 font-semibold text-accent-dark"
                : "border-border bg-surface text-muted hover:border-border hover:bg-surface-hover hover:text-accent-dark",
            )}
          >
            {option.label}
            {option.count != null && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none",
                  active
                    ? "bg-accent/15 text-accent"
                    : "bg-surface-subtle text-muted",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
