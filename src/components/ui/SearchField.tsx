"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Buscar",
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-transparent bg-input-bg pl-10 pr-10 text-sm text-accent-dark outline-none transition placeholder:text-muted/80 focus:border-border focus:bg-surface focus:ring-2 focus:ring-accent/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:bg-surface-hover hover:text-accent-dark"
          aria-label="Limpar busca"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
