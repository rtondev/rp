import { cn } from "@/lib/cn";
import { ROLE_LABELS, type UserRole } from "@/lib/types";

const ROLE_STYLES: Record<UserRole, string> = {
  TURISTA: "bg-surface-hover text-muted border border-border",
  GESTOR: "bg-sky-500/15 text-sky-700",
  ADMIN: "bg-accent/15 text-accent",
};

export function UserRoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function userInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
