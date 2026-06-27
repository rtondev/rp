"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Icon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { getNavItems } from "@/lib/nav-items";
import { cn } from "@/lib/cn";

function NavLink({
  href,
  label,
  icon: NavIcon,
  active,
  compact,
}: {
  href: string;
  label: string;
  icon: Icon;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className="nav-link flex items-center justify-center select-none"
    >
      <span
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-full py-1.5 transition-[background,transform,padding] duration-200 ease-out",
          active
            ? cn(
                "nav-glass-btn",
                compact ? "min-w-[3.25rem] px-2.5" : "min-w-[4.5rem] px-5",
              )
            : compact
              ? "px-1.5 active:scale-95 active:opacity-80"
              : "px-3 active:scale-95 active:opacity-80",
        )}
      >
        <NavIcon
          size={compact ? 18 : 20}
          weight={active ? "fill" : "regular"}
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-accent-dark" : "text-muted",
          )}
        />
        <span
          className={cn(
            "leading-none transition-colors",
            compact ? "text-[9px]" : "text-[10px]",
            active ? "font-semibold text-accent-dark" : "text-muted",
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = useMemo(() => getNavItems(user?.role), [user?.role]);
  const compactNav = navItems.length >= 5;

  const isAuthPage =
    pathname === "/entrar" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/acesso-profissional" ||
    pathname === "/spin";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
      <main className="flex-1 px-5 py-6 pb-28">{children}</main>

      <nav className="glass shadow-nav fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full px-3 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.match(pathname)}
              compact={compactNav}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
