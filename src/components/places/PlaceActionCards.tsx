import Link from "next/link";
import { cn } from "@/lib/cn";

interface PlaceActionCardsProps {
  placeId: string;
  className?: string;
}

const actions = [
  {
    href: (id: string) => `/locais/${id}/sinalizar`,
    emoji: "🚩",
    title: "Sinalizar",
    subtitle: "Reportar um problema",
    className: "border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/15",
  },
  {
    href: (id: string) => `/locais/${id}/elogiar`,
    emoji: "⭐",
    title: "Elogiar",
    subtitle: "Deixar um elogio",
    className: "border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/15",
  },
] as const;

export function PlaceActionCards({ placeId, className }: PlaceActionCardsProps) {
  return (
    <section className={cn("mt-6", className)}>
      <h3 className="mb-3 text-sm font-semibold text-accent-dark">
        Contribua com a comunidade
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href(placeId)}
            className={cn(
              "group flex flex-col items-center rounded-2xl border px-3 py-4 text-center transition active:scale-[0.98]",
              action.className,
            )}
          >
            <span className="text-3xl leading-none" aria-hidden>
              {action.emoji}
            </span>
            <span className="mt-2 text-sm font-semibold text-accent-dark">
              {action.title}
            </span>
            <span className="mt-0.5 text-xs text-muted">{action.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
