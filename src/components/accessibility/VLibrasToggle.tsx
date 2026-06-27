"use client";

import { HandsClapping } from "@phosphor-icons/react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/cn";

export function VLibrasToggle() {
  const { vlibrasEnabled, setVLibrasEnabled } = useAccessibility();

  return (
    <div className="rounded-2xl border border-border bg-surface-subtle p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
              <HandsClapping size={20} weight="duotone" />
            </span>
            <h2 className="text-sm font-semibold text-accent-dark">VLibras</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Ative para exibir o botão flutuante do VLibras em todas as telas.
            Toque nele para traduzir textos e conteúdos para Libras.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={vlibrasEnabled}
          aria-label="Ativar VLibras"
          onClick={() => setVLibrasEnabled(!vlibrasEnabled)}
          className={cn(
            "relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors",
            vlibrasEnabled ? "bg-accent" : "bg-border",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
              vlibrasEnabled && "translate-x-5",
            )}
          />
        </button>
      </div>
    </div>
  );
}
