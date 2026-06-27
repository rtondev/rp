export type NavTone = "default" | "places" | "favorites" | "signal" | "signals";

export const NAV_TONE_STYLES: Record<
  NavTone,
  {
    iconIdle: string;
    iconActive: string;
    labelIdle: string;
    labelActive: string;
    bgIdle: string;
    bgActive: string;
  }
> = {
  default: {
    iconIdle: "text-muted",
    iconActive: "text-accent-dark",
    labelIdle: "text-muted",
    labelActive: "font-semibold text-accent-dark",
    bgIdle: "",
    bgActive: "nav-glass-btn",
  },
  places: {
    iconIdle: "text-sky-600/80",
    iconActive: "text-sky-600",
    labelIdle: "font-medium text-sky-600/75",
    labelActive: "font-semibold text-sky-600",
    bgIdle: "bg-sky-500/10 ring-1 ring-sky-500/15",
    bgActive:
      "bg-sky-500/20 ring-1 ring-sky-500/30 shadow-[0_4px_14px_rgba(14,165,233,0.22)]",
  },
  favorites: {
    iconIdle: "text-rose-500/80",
    iconActive: "text-rose-500",
    labelIdle: "font-medium text-rose-500/75",
    labelActive: "font-semibold text-rose-500",
    bgIdle: "bg-rose-500/10 ring-1 ring-rose-500/15",
    bgActive:
      "bg-rose-500/20 ring-1 ring-rose-500/30 shadow-[0_4px_14px_rgba(244,63,94,0.22)]",
  },
  signal: {
    iconIdle: "text-accent/80",
    iconActive: "text-accent",
    labelIdle: "font-medium text-accent/80",
    labelActive: "font-semibold text-accent",
    bgIdle: "bg-accent/10 ring-1 ring-accent/15",
    bgActive:
      "bg-accent/22 ring-1 ring-accent/35 shadow-[0_4px_14px_rgba(225,123,33,0.28)]",
  },
  signals: {
    iconIdle: "text-amber-600/80",
    iconActive: "text-amber-600",
    labelIdle: "font-medium text-amber-600/75",
    labelActive: "font-semibold text-amber-600",
    bgIdle: "bg-amber-500/10 ring-1 ring-amber-500/15",
    bgActive:
      "bg-amber-500/20 ring-1 ring-amber-500/30 shadow-[0_4px_14px_rgba(245,158,11,0.22)]",
  },
};
