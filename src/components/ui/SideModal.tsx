"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface SideModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SideModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: SideModalProps) {
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 overlay-backdrop backdrop-blur-[1px]"
        aria-label="Fechar painel"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-modal-title"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-surface shadow-2xl",
          "animate-[slideInRight_0.28s_ease-out]",
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="side-modal-title"
              className="text-lg font-semibold text-accent-dark"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-surface-hover"
            aria-label="Fechar"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}
