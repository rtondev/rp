"use client";

import { cn } from "@/lib/cn";
import {
  PRIORITY_LEVELS,
  PRIORITY_TONE_CLASSES,
  type PriorityValue,
} from "@/lib/priorities";

interface PriorityPickerProps {
  value: PriorityValue;
  onChange: (value: PriorityValue) => void;
  label?: string;
  className?: string;
}

export function PriorityPicker({
  value,
  onChange,
  label = "Nível de urgência",
  className,
}: PriorityPickerProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-sm font-medium text-accent-dark">{label}</p>
      <div className="flex flex-col gap-2">
        {PRIORITY_LEVELS.map((level) => {
          const selected = value === level.value;
          const tones = PRIORITY_TONE_CLASSES[level.tone];

          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.99]",
                selected ? tones.active : tones.idle,
              )}
            >
              <span
                className={cn(
                  "text-2xl leading-none",
                  !selected && "opacity-45 grayscale",
                )}
                aria-hidden
              >
                {level.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm font-semibold",
                    selected ? "text-accent-dark" : "text-muted",
                  )}
                >
                  {level.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs",
                    selected ? "text-muted" : "text-muted/80",
                  )}
                >
                  {level.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PriorityBadgeProps {
  priority: number;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const level =
    PRIORITY_LEVELS.find((item) => item.value === priority) ??
    PRIORITY_LEVELS[2];
  const tones = PRIORITY_TONE_CLASSES[level.tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones.badge,
        className,
      )}
    >
      <span aria-hidden>{level.emoji}</span>
      {level.label}
    </span>
  );
}
