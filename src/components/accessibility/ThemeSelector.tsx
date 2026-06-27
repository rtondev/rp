"use client";

import {
  DeviceMobile,
  Eye,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  themeLabels,
  type ThemePreference,
  THEME_PREFERENCES,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

const icons: Record<ThemePreference, typeof Sun> = {
  system: DeviceMobile,
  light: Sun,
  dark: Moon,
  "high-contrast": Eye,
};

export function ThemeSelector() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="grid gap-2">
      {THEME_PREFERENCES.map((key) => {
        const { label, description } = themeLabels[key];
        const Icon = icons[key];
        const active = preference === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => setPreference(key)}
            aria-pressed={active}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
              active
                ? "border-accent bg-accent/10"
                : "border-border bg-surface hover:bg-surface-hover",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                active ? "bg-accent/15 text-accent" : "bg-surface-hover text-muted",
              )}
            >
              <Icon size={20} weight={active ? "fill" : "duotone"} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-accent-dark">
                {label}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted">
                {description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
