"use client";

import { cn } from "@/lib/cn";
import {
  CATEGORY_ICON_MAP,
  CATEGORY_ICON_OPTIONS,
} from "@/lib/category-icons";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = "Ícone" }: IconPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-accent-dark">{label}</span>
      <div className="grid grid-cols-6 gap-2">
        {CATEGORY_ICON_OPTIONS.map((iconName) => {
          const IconComponent = CATEGORY_ICON_MAP[iconName];
          const selected = value === iconName;
          return (
            <button
              key={iconName}
              type="button"
              title={iconName}
              onClick={() => onChange(iconName)}
              className={cn(
                "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition",
                selected
                  ? "border-accent-dark bg-accent-dark text-on-accent-dark"
                  : "border-border bg-surface text-muted hover:border-accent-dark/30 hover:text-accent-dark",
              )}
            >
              <IconComponent size={20} weight={selected ? "fill" : "regular"} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
