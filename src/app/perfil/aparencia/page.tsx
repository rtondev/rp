"use client";

import { HandsClapping } from "@phosphor-icons/react";
import { ThemeSelector } from "@/components/accessibility/ThemeSelector";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AparenciaPage() {
  return (
    <div>
      <PageHeader
        title="Aparência e acessibilidade"
        subtitle="Personalize o visual e conheça os recursos inclusivos"
        backHref="/perfil"
      />

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-1 text-sm font-semibold text-accent-dark">Tema</h2>
          <p className="mb-4 text-sm text-muted">
            Escolha como o app deve aparecer. O padrão segue as configurações do
            seu dispositivo.
          </p>
          <ThemeSelector />
        </section>

        <section className="rounded-2xl border border-border bg-surface-subtle p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
              <HandsClapping size={20} weight="duotone" />
            </span>
            <h2 className="text-sm font-semibold text-accent-dark">VLibras</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            O botão flutuante do VLibras fica disponível em todas as telas do
            app. Toque nele para traduzir textos e conteúdos para Libras.
          </p>
        </section>
      </div>
    </div>
  );
}
