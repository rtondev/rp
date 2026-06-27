import Link from "next/link";
import { CaretRight, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface ShortcutLinkProps {
  href: string;
  label: string;
  icon: Icon;
  iconClassName?: string;
  className?: string;
}

export function ShortcutLink({
  href,
  label,
  icon: IconComponent,
  iconClassName = "text-accent",
  className,
}: ShortcutLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group -mx-1 flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-surface-hover active:opacity-80",
        className,
      )}
    >
      <IconComponent
        size={22}
        weight="duotone"
        className={cn("shrink-0 transition-colors", iconClassName)}
      />
      <span className="min-w-0 flex-1 text-sm font-medium text-accent-dark">
        {label}
      </span>
      <CaretRight
        size={16}
        weight="bold"
        className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden
      />
    </Link>
  );
}
