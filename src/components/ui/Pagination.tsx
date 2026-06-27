"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-3 py-2",
        className,
      )}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-accent-dark transition enabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CaretLeft size={16} weight="bold" />
        Anterior
      </button>

      <div className="text-center text-xs text-muted">
        <span className="font-semibold text-accent-dark">{page}</span>
        <span> / {totalPages}</span>
        <span className="mt-0.5 block">{total} no total</span>
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-accent-dark transition enabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );
}
