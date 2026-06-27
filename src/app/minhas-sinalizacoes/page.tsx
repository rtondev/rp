"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { PlaceSignalCard } from "@/components/signals/RespondSignalModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 8;

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-accent-dark">{label}</p>
      {children}
    </div>
  );
}

export default function MinhasSinalizacoesPage() {
  const { isTurista } = useAuth();
  const router = useRouter();

  const [signals, setSignals] = useState<PlaceSignal[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<SignalStatusFilter>("pending");
  const [type, setType] = useState<SignalType | "all">("SINALIZACAO");
  const [sort, setSort] = useState<SignalSortFilter>("newest");

  useEffect(() => {
    if (!isTurista) {
      router.replace("/perfil");
    }
  }, [isTurista, router]);

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
    if (!isTurista) return;
    setLoading(true);
    try {
      const result = await api.me.signals(query);
      setSignals(result.data);
      setMeta(result.meta);
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao carregar sinalizações"));
    } finally {
      setLoading(false);
    }
  }, [isTurista, query]);

  useEffect(() => {
    void loadSignals();
  }, [loadSignals]);

  const typeOptions = useMemo(
    () => [
      { value: "SINALIZACAO" as const, label: "Sinalizações" },
      { value: "ELOGIO" as const, label: "Elogios" },
      { value: "all" as const, label: "Todos" },
    ],
    [],
  );

  const statusOptions = useMemo(() => {
    const pending = meta?.pendingTotal ?? 0;
    const answered = meta?.answeredTotal ?? 0;

    return [
      {
        value: "pending" as const,
        label: "Pendentes",
        count: pending,
      },
      {
        value: "answered" as const,
        label: "Resolvidas",
        count: answered,
      },
      {
        value: "all" as const,
        label: "Todas",
        count: pending + answered,
      },
    ];
  }, [meta]);

  if (!isTurista) return null;

  return (
    <div>
      <PageHeader
        title="Minhas sinalizações"
        subtitle="Acompanhe o que você reportou nos locais"
      />

      <div className="mb-4 space-y-4">
        <FilterGroup label="Tipo">
          <FilterPills options={typeOptions} value={type} onChange={setType} />
        </FilterGroup>

        <FilterGroup label="Situação">
          <FilterPills
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
        </FilterGroup>

        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por local ou mensagem"
        />

        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2.5">
          <span className="text-sm font-medium text-accent-dark">Ordenar</span>
          <div className="inline-flex rounded-full border border-border bg-surface-subtle p-0.5">
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
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  sort === option.value
                    ? "bg-surface text-accent-dark shadow-soft"
                    : "text-muted hover:text-accent-dark",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Spin size="sm" loop={false} />
      ) : signals.length === 0 ? (
        <EmptyState
          title="Nenhuma sinalização"
          description={
            debouncedSearch || status !== "pending" || type !== "SINALIZACAO"
              ? "Tente outro termo ou ajuste os filtros."
              : "Visite um local e envie uma sinalização ou elogio."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {signals.map((signal) => (
            <PlaceSignalCard
              key={signal.id}
              signal={signal}
              showPlaceLink
              showResolutionStatus
              showTypeBadge={type === "all"}
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
    </div>
  );
}
