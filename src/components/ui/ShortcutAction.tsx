import { CaretRight, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface ShortcutActionProps {
  label: string;
  icon: Icon;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  variant?: "default" | "danger";
}

export function ShortcutAction({
  label,
  icon: IconComponent,
  onClick,
  className,
  iconClassName,
  labelClassName,
  variant = "default",
}: ShortcutActionProps) {
  const resolvedIconClass =
    iconClassName ??
    (variant === "danger" ? "text-red-500" : "text-accent");
  const resolvedLabelClass =
    labelClassName ??
    (variant === "danger" ? "text-red-600" : "text-accent-dark");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group -mx-1 flex w-full items-center gap-3 rounded-lg px-1 py-3 text-left transition-colors hover:bg-surface-hover active:opacity-80",
        variant === "danger" && "hover:bg-transparent",
        className,
      )}
    >
      <IconComponent
        size={22}
        weight={variant === "danger" ? "regular" : "duotone"}
        className={cn("shrink-0 transition-colors", resolvedIconClass)}
      />
      <span
        className={cn(
          "min-w-0 flex-1 text-sm font-medium",
          resolvedLabelClass,
        )}
      >
        {label}
      </span>
      <CaretRight
        size={16}
        weight="bold"
        className={cn(
          "shrink-0 text-muted transition-transform group-hover:translate-x-0.5",
          variant === "danger" && "group-hover:text-red-500",
        )}
        aria-hidden
      />
    </button>
  );
}
