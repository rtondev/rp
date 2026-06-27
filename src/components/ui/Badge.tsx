import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "accent" | "success" | "warning";

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-accent-dark border border-border",
  accent: "bg-accent/15 text-accent",
  success: "bg-emerald-500/15 text-emerald-700",
  warning: "bg-amber-500/15 text-amber-800",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
