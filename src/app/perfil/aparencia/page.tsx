"use client";

import { ThemeSelector } from "@/components/accessibility/ThemeSelector";
import { VLibrasToggle } from "@/components/accessibility/VLibrasToggle";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AparenciaPage() {
  return (
    <div>
      <PageHeader
        title="Aparência e acessibilidade"
        subtitle="Personalize o visual e os recursos inclusivos"
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

        <section>
          <h2 className="mb-1 text-sm font-semibold text-accent-dark">
            Acessibilidade
          </h2>
          <p className="mb-4 text-sm text-muted">
            Recursos opcionais que você pode ligar quando precisar.
          </p>
          <VLibrasToggle />
        </section>
      </div>
    </div>
  );
}
