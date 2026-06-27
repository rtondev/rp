import Link from "next/link";

export function LegalLinks() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-6">
      <p className="text-xs text-muted">Informações legais</p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link
          href="/termos"
          className="text-sm font-medium text-accent-dark hover:text-accent"
        >
          Termos de uso
        </Link>
        <span className="text-muted" aria-hidden>
          ·
        </span>
        <Link
          href="/privacidade"
          className="text-sm font-medium text-accent-dark hover:text-accent"
        >
          Política de privacidade
        </Link>
      </div>
    </div>
  );
}
