"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChatCircleDots } from "@phosphor-icons/react";
import type { PlaceSignal } from "@/lib/types";
import { formatFullDate, formatRelativeDate, formatDurationBetween } from "@/lib/format-date";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/PriorityPicker";
import { getPriorityLevel } from "@/lib/priorities";
import { SideModal } from "@/components/ui/SideModal";
import { StarRating } from "@/components/ui/StarRating";
import { Textarea } from "@/components/ui/Textarea";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/cn";

interface RespondSignalModalProps {
  signal: PlaceSignal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (response: string) => Promise<void>;
}

export function RespondSignalModal({
  signal,
  open,
  onClose,
  onSubmit,
}: RespondSignalModalProps) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setResponse("");
  }, [open, signal?.id]);

  if (!signal) return null;

  async function handleSubmit() {
    if (!response.trim()) {
      toastError("Digite uma resposta");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(response.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SideModal
      open={open}
      onClose={onClose}
      title="Responder feedback"
      subtitle={
        signal.type === "ELOGIO"
          ? "Agradeça e interaja com o elogio"
          : "Explique o que será feito sobre a sinalização"
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-surface-subtle p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={signal.type === "ELOGIO" ? "success" : "warning"}>
              {signal.type === "ELOGIO" ? "⭐ Elogio" : "🚩 Sinalização"}
            </Badge>
            {signal.type === "SINALIZACAO" && (
              <PriorityBadge priority={signal.priority} />
            )}
            {signal.type === "ELOGIO" && signal.rating != null && (
              <StarRating value={signal.rating} readOnly size={16} />
            )}
          </div>
          {signal.place && (
            <Link
              href={`/locais/${signal.place.id}`}
              className="mt-2 block text-sm font-medium text-accent hover:underline"
            >
              {signal.place.title}
            </Link>
          )}
          <p className="mt-3 text-sm leading-relaxed">{signal.message}</p>
          {signal.user && (
            <p className="mt-2 text-xs text-muted">— {signal.user.name}</p>
          )}
          <p className="mt-2 text-xs text-muted">
            Enviado {formatRelativeDate(signal.createdAt)} ·{" "}
            {formatFullDate(signal.createdAt)}
          </p>
        </div>

        <Textarea
          label="Sua resposta"
          placeholder={
            signal.type === "ELOGIO"
              ? "Obrigado pelo carinho! Ficamos felizes em receber você..."
              : "Obrigado por avisar. Já estamos verificando e..."
          }
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={5}
        />

        <Button fullWidth onClick={handleSubmit} disabled={loading}>
          <ChatCircleDots size={18} weight="fill" className="mr-2" />
          {loading ? "Enviando..." : "Enviar resposta"}
        </Button>
      </div>
    </SideModal>
  );
}

function SignalTimestamp({
  createdAt,
  respondedAt,
  compact = false,
}: {
  createdAt: string;
  respondedAt?: string | null;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <time
        dateTime={createdAt}
        title={formatFullDate(createdAt)}
        className="shrink-0 text-sm text-muted"
      >
        {formatRelativeDate(createdAt)}
      </time>
    );
  }

  return (
    <div className="flex flex-col items-end gap-0.5 text-right text-xs text-muted">
      <time dateTime={createdAt} title={formatFullDate(createdAt)}>
        {formatRelativeDate(createdAt)}
      </time>
      {respondedAt && (
        <time dateTime={respondedAt} title={formatFullDate(respondedAt)}>
          Respondido {formatRelativeDate(respondedAt)}
        </time>
      )}
    </div>
  );
}

interface SignalResolutionBadgeProps {
  signal: PlaceSignal;
  simple?: boolean;
}

export function SignalResolutionBadge({
  signal,
  simple = false,
}: SignalResolutionBadgeProps) {
  const resolved = Boolean(signal.response);
  const duration =
    resolved && signal.respondedAt
      ? formatDurationBetween(signal.createdAt, signal.respondedAt)
      : null;

  if (simple) {
    const pendingLabel =
      signal.type === "ELOGIO" ? "Aguardando resposta" : "Aguardando resolução";
    const resolvedLabel = signal.type === "ELOGIO" ? "Respondido" : "Resolvido";
    const label = resolved
      ? duration
        ? `${resolvedLabel} em ${duration}`
        : resolvedLabel
      : pendingLabel;

    return (
      <Badge variant={resolved ? "success" : "warning"} className="text-xs">
        {label}
      </Badge>
    );
  }

  if (signal.type === "ELOGIO") {
    const label = resolved
      ? duration
        ? `Respondido em ${duration}`
        : "Respondido"
      : "Sem resposta";

    return (
      <Badge variant={resolved ? "success" : "default"}>
        {label}
      </Badge>
    );
  }

  const label = resolved
    ? duration
      ? `Resolvido em ${duration}`
      : "Resolvido"
    : "Pendente";

  return (
    <Badge variant={resolved ? "success" : "warning"}>
      {label}
    </Badge>
  );
}

interface PlaceSignalCardProps {
  signal: PlaceSignal;
  canRespond?: boolean;
  onRespond?: () => void;
  showPlaceLink?: boolean;
  showResolutionStatus?: boolean;
  showTypeBadge?: boolean;
}

export function PlaceSignalCard({
  signal,
  canRespond = false,
  onRespond,
  showPlaceLink = false,
  showResolutionStatus = false,
  showTypeBadge = true,
}: PlaceSignalCardProps) {
  if (showResolutionStatus) {
    const typeLabel =
      signal.type === "ELOGIO" ? "Elogio" : "Sinalização";
    const priorityLevel =
      signal.type === "SINALIZACAO"
        ? getPriorityLevel(signal.priority)
        : null;

    return (
      <article className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          {showPlaceLink && signal.place ? (
            <Link
              href={`/locais/${signal.place.id}`}
              className="min-w-0 text-base font-semibold leading-snug text-accent-dark hover:underline"
            >
              {signal.place.title}
            </Link>
          ) : (
            <span className="text-base font-semibold text-accent-dark">
              {typeLabel}
            </span>
          )}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <SignalTimestamp createdAt={signal.createdAt} compact />
            <SignalResolutionBadge signal={signal} simple />
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {showTypeBadge && (
            <Badge variant={signal.type === "ELOGIO" ? "success" : "accent"}>
              {typeLabel}
            </Badge>
          )}
          {priorityLevel && (
            <PriorityBadge priority={signal.priority} />
          )}
          {signal.type === "ELOGIO" && signal.rating != null && (
            <StarRating value={signal.rating} readOnly size={14} />
          )}
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-accent-dark">
          {signal.message}
        </p>

        {signal.response && (
          <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-3">
            <p className="text-sm font-medium text-emerald-800">
              Resposta da gestão
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-accent-dark">
              {signal.response}
            </p>
            {signal.respondedBy && (
              <p className="mt-2 text-sm text-muted">
                {signal.respondedBy.name}
              </p>
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-border/60 bg-surface p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge variant={signal.type === "ELOGIO" ? "success" : "warning"}>
            {signal.type === "ELOGIO" ? "⭐ Elogio" : "🚩 Sinalização"}
          </Badge>
          {signal.type === "SINALIZACAO" && (
            <PriorityBadge priority={signal.priority} />
          )}
          {signal.type === "ELOGIO" && signal.rating != null && (
            <StarRating value={signal.rating} readOnly size={16} />
          )}
        </div>
        <SignalTimestamp
          createdAt={signal.createdAt}
          respondedAt={signal.respondedAt}
        />
      </div>

      {showPlaceLink && signal.place && (
        <Link
          href={`/locais/${signal.place.id}`}
          className="mt-2 block text-sm font-semibold text-accent hover:underline"
        >
          {signal.place.title}
        </Link>
      )}

      <p className="mt-2 text-sm leading-relaxed text-accent-dark">
        {signal.message}
      </p>
      {signal.user && (
        <p className="mt-1 text-xs text-muted">— {signal.user.name}</p>
      )}

      {signal.response && (
        <div className="mt-3 rounded-xl bg-accent/5 p-3">
          <p className="text-xs font-medium text-accent">Resposta da gestão</p>
          <p className="mt-1 text-sm">{signal.response}</p>
          {signal.respondedBy && (
            <p className="mt-1 text-xs text-muted">— {signal.respondedBy.name}</p>
          )}
        </div>
      )}

      {canRespond && !signal.response && onRespond && (
        <Button
          variant="secondary"
          className="mt-3 w-full"
          onClick={onRespond}
        >
          <ChatCircleDots size={18} weight="fill" className="mr-2" />
          Responder
        </Button>
      )}
    </article>
  );
}
