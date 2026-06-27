export const PRIORITY_LEVELS = [
  {
    value: 1,
    label: "Tranquilo",
    emoji: "🌿",
    description: "Só um detalhe, sem pressa",
    tone: "emerald",
  },
  {
    value: 2,
    label: "Leve",
    emoji: "💧",
    description: "Dá para resolver com calma",
    tone: "sky",
  },
  {
    value: 3,
    label: "Moderado",
    emoji: "⚡",
    description: "Precisa de atenção em breve",
    tone: "amber",
  },
  {
    value: 4,
    label: "Urgente",
    emoji: "🔥",
    description: "Importante agir logo",
    tone: "orange",
  },
  {
    value: 5,
    label: "Crítico",
    emoji: "🚨",
    description: "Situação grave ou imediata",
    tone: "red",
  },
] as const;

export type PriorityValue = (typeof PRIORITY_LEVELS)[number]["value"];

export function getPriorityLevel(priority: number) {
  return (
    PRIORITY_LEVELS.find((level) => level.value === priority) ??
    PRIORITY_LEVELS[2]
  );
}

export const PRIORITY_TONE_CLASSES: Record<
  (typeof PRIORITY_LEVELS)[number]["tone"],
  { idle: string; active: string; badge: string }
> = {
  emerald: {
    idle: "border-border bg-surface-subtle hover:border-border hover:bg-surface-hover",
    active: "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-700",
  },
  sky: {
    idle: "border-border bg-surface-subtle hover:border-border hover:bg-surface-hover",
    active: "border-sky-500 bg-sky-500/15 ring-2 ring-sky-500/25",
    badge: "bg-sky-500/20 text-sky-700",
  },
  amber: {
    idle: "border-border bg-surface-subtle hover:border-border hover:bg-surface-hover",
    active: "border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/25",
    badge: "bg-amber-500/20 text-amber-800",
  },
  orange: {
    idle: "border-border bg-surface-subtle hover:border-border hover:bg-surface-hover",
    active: "border-orange-500 bg-orange-500/15 ring-2 ring-orange-500/25",
    badge: "bg-orange-500/20 text-orange-800",
  },
  red: {
    idle: "border-border bg-surface-subtle hover:border-border hover:bg-surface-hover",
    active: "border-red-500 bg-red-500/15 ring-2 ring-red-500/25",
    badge: "bg-red-500/20 text-red-700",
  },
};

export const PRIORITY_ACCENT_BORDER: Record<
  (typeof PRIORITY_LEVELS)[number]["tone"],
  string
> = {
  emerald: "border-l-emerald-500",
  sky: "border-l-sky-500",
  amber: "border-l-amber-500",
  orange: "border-l-orange-500",
  red: "border-l-red-500",
};
