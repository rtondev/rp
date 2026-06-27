"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type {
  GestorSignalsQuery,
  PaginatedMeta,
  PlaceSignal,
  SignalSortFilter,
  SignalStatusFilter,
  SignalType,
} from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Spin } from "@/components/ui/Spin";
import { SearchField } from "@/components/ui/SearchField";
import { FilterPills } from "@/components/ui/FilterPills";
import { Pagination } from "@/components/ui/Pagination";
import {
  PlaceSignalCard,
  RespondSignalModal,
} from "@/components/signals/RespondSignalModal";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 8;

export default function GestorSinalizacoesPage() {
  const { canRespondSignals } = useAuth();
  const router = useRouter();

  const [signals, setSignals] = useState<PlaceSignal[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<PlaceSignal | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<SignalStatusFilter>("all");
  const [type, setType] = useState<SignalType | "all">("all");
  const [sort, setSort] = useState<SignalSortFilter>("newest");

  useEffect(() => {
    if (!canRespondSignals) {
      router.replace("/");
    }
  }, [canRespondSignals, router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, type, sort]);

  const query = useMemo<GestorSignalsQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status,
      type: type === "all" ? undefined : type,
      sort,
    }),
    [page, debouncedSearch, status, type, sort],
  );

  const loadSignals = useCallback(async () => {
    if (!canRespondSignals) return;
    setLoading(true);
    try {
      const result = await api.gestor.signals(query);
      setSignals(result.data);
      setMeta(result.meta);
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao carregar sinalizações"));
    } finally {
      setLoading(false);
    }
  }, [canRespondSignals, query]);

  useEffect(() => {
    void loadSignals();
  }, [loadSignals]);

  async function handleRespond(response: string) {
    if (!respondingTo) return;
    try {
      await api.places.respondSignal(
        respondingTo.placeId,
        respondingTo.id,
        response,
      );
      await loadSignals();
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao responder"));
      throw err;
    }
  }

  const statusOptions = useMemo(
    () => [
      { value: "all" as const, label: "Todos", count: meta?.total },
      {
        value: "pending" as const,
        label: "Pendentes",
        count: meta?.pendingTotal,
      },
      {
        value: "answered" as const,
        label: "Respondidas",
        count: meta?.answeredTotal,
      },
    ],
    [meta],
  );

  const typeOptions = useMemo(
    () => [
      { value: "all" as const, label: "Todos tipos" },
      { value: "SINALIZACAO" as const, label: "🚩 Sinalizações" },
      { value: "ELOGIO" as const, label: "⭐ Elogios" },
    ],
    [],
  );

  if (!canRespondSignals) return null;

  return (
    <div>
      <PageHeader
        title="Sinalizações"
        subtitle="Busque, filtre e responda feedbacks"
      />

      <div className="mb-4 space-y-3">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por local, mensagem ou turista"
        />

        <FilterPills
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />

        <FilterPills options={typeOptions} value={type} onChange={setType} />

        <div className="flex items-center justify-between rounded-2xl bg-surface-subtle px-3 py-2">
          <span className="text-xs font-medium text-muted">Ordenar</span>
          <div className="inline-flex rounded-full bg-surface p-0.5 shadow-soft">
            {(
              [
                { value: "newest", label: "Recentes" },
                { value: "oldest", label: "Antigas" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  sort === option.value
                    ? "bg-accent-dark text-on-accent-dark"
                    : "text-muted hover:text-accent-dark",
                )}
              >
                {option.value === "newest" && (
                  <ArrowsDownUp size={14} weight="bold" />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Spin size="sm" loop={false} />
      ) : signals.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-3 font-medium text-accent-dark">
            Nenhum resultado
          </p>
          <p className="mt-1 text-sm text-muted">
            Tente outro termo ou ajuste os filtros.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {signals.map((signal) => (
            <PlaceSignalCard
              key={signal.id}
              signal={signal}
              showPlaceLink
              canRespond={!signal.response}
              onRespond={() => setRespondingTo(signal)}
            />
          ))}

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              className="mt-2"
            />
          )}
        </div>
      )}

      <RespondSignalModal
        signal={respondingTo}
        open={respondingTo != null}
        onClose={() => setRespondingTo(null)}
        onSubmit={handleRespond}
      />
    </div>
  );
}
