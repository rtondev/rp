"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { CategoryIcon } from "@/lib/category-icons";

interface Tab {
  id: string;
  label: string;
  href: string;
  icon?: string | null;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isAllTab = tab.href === "/" || tab.href === "/locais";
        const active = isAllTab
          ? pathname === tab.href
          : pathname === tab.href;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-accent-dark text-on-accent-dark"
                : "bg-surface-subtle text-muted hover:text-accent-dark",
            )}
          >
            {isAllTab ? (
              <SquaresFour
                size={16}
                weight={active ? "fill" : "regular"}
                className="shrink-0"
              />
            ) : (
              <CategoryIcon
                name={tab.icon}
                size={16}
                weight={active ? "fill" : "regular"}
                className="shrink-0"
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
