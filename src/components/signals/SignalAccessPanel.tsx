"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { SignalAccess } from "@/lib/types";
import { buildSignalPageUrl } from "@/lib/signal-code-url";
import { Button } from "@/components/ui/Button";
import { Spin } from "@/components/ui/Spin";
import { getErrorMessage } from "@/lib/validate";

interface SignalAccessPanelProps {
  placeId: string;
  className?: string;
}

export function SignalAccessPanel({
  placeId,
  className,
}: SignalAccessPanelProps) {
  const [access, setAccess] = useState<SignalAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.places
      .signalAccess(placeId)
      .then(setAccess)
      .catch((err) =>
        setError(getErrorMessage(err, "Não foi possível carregar o código")),
      )
      .finally(() => setLoading(false));
  }, [placeId]);

  const copyCode = useCallback(async () => {
    if (!access) return;
    try {
      await navigator.clipboard.writeText(access.signalCode);
      toast.success("Código copiado");
    } catch {
      toast.error("Não foi possível copiar o código");
    }
  }, [access]);

  if (loading) {
    return (
      <div className={className}>
        <Spin size="sm" loop={false} />
      </div>
    );
  }

  if (error || !access) {
    return (
      <div
        className={`rounded-2xl border border-border bg-surface p-4 text-sm text-muted ${className ?? ""}`}
      >
        {error ?? "Código indisponível"}
      </div>
    );
  }

  const qrUrl = buildSignalPageUrl(access.signalCode);

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-4 ${className ?? ""}`}
    >
      <p className="text-sm font-semibold text-accent-dark">
        Código para sinalização
      </p>
      <p className="mt-1 text-xs text-muted">
        Turistas usam este código ou o QR para enviar sinalizações em{" "}
        <span className="font-medium text-accent-dark">{access.title}</span>.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-xl border border-border bg-white p-3">
          <QRCodeSVG value={qrUrl} size={160} level="M" includeMargin />
        </div>

        <div className="flex w-full flex-col items-center gap-3 sm:items-start sm:pt-2">
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Código de 6 dígitos
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-accent-dark">
              {access.signalCode}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={copyCode}
          >
            <Copy size={16} weight="bold" />
            Copiar código
          </Button>
        </div>
      </div>
    </div>
  );
}
