"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type { PlaceSignal } from "@/lib/types";
import { SignalResolutionBadge } from "@/components/signals/RespondSignalModal";
import { formatRelativeDate } from "@/lib/format-date";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge } from "@/components/ui/PriorityPicker";
import { StarRating } from "@/components/ui/StarRating";
import { Spin } from "@/components/ui/Spin";

type HomeLastSignalProps = {
  mode: "turista" | "gestor";
};

export function HomeLastSignal({ mode }: HomeLastSignalProps) {
  const [signal, setSignal] = useState<PlaceSignal | null>(null);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals =
      mode === "turista" ? api.me.signals : api.gestor.signals;

    fetchSignals({
      limit: 1,
      sort: "newest",
      status: mode === "gestor" ? "pending" : "all",
    })
      .then((res) => {
        setSignal(res.data[0] ?? null);
        setPendingTotal(res.meta?.pendingTotal ?? 0);
      })
      .catch(() => {
        setSignal(null);
        setPendingTotal(0);
      })
      .finally(() => setLoading(false));
  }, [mode]);

  if (loading) {
    return (
      <section className="mt-8">
        <Spin className="py-8" />
      </section>
    );
  }

  if (!signal) return null;

  const listHref =
    mode === "turista" ? "/minhas-sinalizacoes" : "/gestor/sinalizacoes";
  const title =
    mode === "turista" ? "Sua última sinalização" : "Alerta mais recente";
  const typeLabel = signal.type === "ELOGIO" ? "Elogio" : "Sinalização";

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-accent-dark">{title}</h2>
          {mode === "turista" && pendingTotal > 0 && (
            <p className="mt-0.5 text-xs text-muted">
              {pendingTotal}{" "}
              {pendingTotal === 1 ? "pendente" : "pendentes"}
            </p>
          )}
          {mode === "gestor" && pendingTotal > 1 && (
            <p className="mt-0.5 text-xs text-muted">
              +{pendingTotal - 1}{" "}
              {pendingTotal - 1 === 1 ? "outro alerta" : "outros alertas"}
            </p>
          )}
        </div>
        <Link
          href={listHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          Ver todas
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      <Link
        href={listHref}
        className="block rounded-2xl border border-border bg-surface p-4 transition hover:border-border hover:bg-surface-hover active:scale-[0.995]"
      >
        <div className="flex items-start justify-between gap-3">
          {signal.place ? (
            <p className="min-w-0 text-base font-semibold leading-snug text-accent-dark">
              {signal.place.title}
            </p>
          ) : (
            <p className="text-base font-semibold text-accent-dark">
              {typeLabel}
            </p>
          )}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <time
              dateTime={signal.createdAt}
              className="text-sm text-muted"
            >
              {formatRelativeDate(signal.createdAt)}
            </time>
            <SignalResolutionBadge signal={signal} simple />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={signal.type === "ELOGIO" ? "success" : "accent"}>
            {typeLabel}
          </Badge>
          {signal.type === "SINALIZACAO" && (
            <PriorityBadge priority={signal.priority} />
          )}
          {signal.type === "ELOGIO" && signal.rating != null && (
            <StarRating value={signal.rating} readOnly size={14} />
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-accent-dark">
          {signal.message}
        </p>

        {signal.response && (
          <p className="mt-2 line-clamp-1 text-sm text-emerald-700">
            Resposta: {signal.response}
          </p>
        )}
      </Link>
    </section>
  );
}
