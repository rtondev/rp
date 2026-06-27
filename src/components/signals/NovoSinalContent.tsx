"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  Keyboard,
  MapPin,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { ResolvedSignalTarget } from "@/lib/types";
import {
  formatSignalCodeInput,
  parseSignalCodeFromScan,
} from "@/lib/signal-code-url";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QrCodeScanner } from "@/components/signals/QrCodeScanner";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";
import { cn } from "@/lib/cn";

type InputMode = "code" | "scan";

export function NovoSinalContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";

  const [mode, setMode] = useState<InputMode>("code");
  const [code, setCode] = useState(formatSignalCodeInput(initialCode));
  const [codeError, setCodeError] = useState<string>();
  const [resolving, setResolving] = useState(false);
  const [target, setTarget] = useState<ResolvedSignalTarget | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      const next = initialCode
        ? `/sinalizar?code=${formatSignalCodeInput(initialCode)}`
        : "/sinalizar";
      router.replace(
        `/entrar?next=${encodeURIComponent(next)}`,
      );
    }
  }, [authLoading, user, router, initialCode]);

  const resolveCode = useCallback(async (rawCode: string) => {
    const normalized = formatSignalCodeInput(rawCode);
    if (normalized.length !== 6) {
      setCodeError("Informe os 6 dígitos do código");
      toastError("Código deve ter 6 dígitos");
      return;
    }

    setResolving(true);
    setCodeError(undefined);
    try {
      const result = await api.signals.resolve(normalized);
      setTarget(result);
      setCode(normalized);
    } catch (err) {
      const message = getErrorMessage(err, "Código não encontrado");
      setTarget(null);
      setCodeError(message);
      toastError(message);
    } finally {
      setResolving(false);
    }
  }, []);

  useEffect(() => {
    if (!user || initialCode.length !== 6) return;
    const normalized = formatSignalCodeInput(initialCode);
    if (normalized.length === 6) {
      resolveCode(normalized);
    }
  }, [user, initialCode, resolveCode]);

  const handleScan = useCallback(
    (text: string) => {
      const parsed = parseSignalCodeFromScan(text);
      if (!parsed) {
        toastError("QR code inválido");
        return;
      }
      setMode("code");
      resolveCode(parsed);
    },
    [resolveCode],
  );

  if (authLoading || !user) return null;

  return (
    <div>
      <PageHeader
        title="Novo sinal"
        subtitle="Digite o código de 6 dígitos ou leia o QR do local"
        backHref="/"
      />

      <div className="mb-4 flex gap-2 rounded-2xl border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setMode("code")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition",
            mode === "code"
              ? "bg-accent/10 text-accent-dark"
              : "text-muted hover:text-accent-dark",
          )}
        >
          <Keyboard size={18} weight="duotone" />
          Código
        </button>
        <button
          type="button"
          onClick={() => setMode("scan")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition",
            mode === "scan"
              ? "bg-accent/10 text-accent-dark"
              : "text-muted hover:text-accent-dark",
          )}
        >
          <Camera size={18} weight="duotone" />
          QR Code
        </button>
      </div>

      {mode === "code" ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            resolveCode(code);
          }}
        >
          <Input
            label="Código de 6 dígitos"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            error={codeError}
            placeholder="000000"
            className="text-center font-mono text-2xl tracking-[0.25em]"
            onChange={(e) => {
              setCode(formatSignalCodeInput(e.target.value));
              if (codeError) setCodeError(undefined);
              if (target) setTarget(null);
            }}
          />
          <Button type="submit" fullWidth disabled={resolving || code.length !== 6}>
            {resolving ? "Buscando..." : "Continuar"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Aponte a câmera para o QR code exibido pelo gestor do local.
          </p>
          <QrCodeScanner
            active={mode === "scan"}
            onScan={handleScan}
            onError={(message) => toastError(message)}
          />
        </div>
      )}

      {target && (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <MapPin size={22} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <Badge variant="accent" className="mb-2">
                Local
              </Badge>
              <h2 className="text-lg font-semibold text-accent-dark">
                {target.title}
              </h2>
              {!target.available && (
                <p className="mt-1 text-sm text-amber-700">
                  Este local está marcado como indisponível, mas você ainda pode
                  enviar um sinal.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Link href={`/locais/${target.id}/sinalizar`}>
              <Button fullWidth>🚩 Enviar sinalização</Button>
            </Link>
            <Link href={`/locais/${target.id}/elogiar`}>
              <Button fullWidth variant="secondary">
                ⭐ Enviar elogio
              </Button>
            </Link>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setTarget(null);
                setCode("");
              }}
            >
              Usar outro código
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
