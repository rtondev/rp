"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spin } from "@/components/ui/Spin";
import { ApiError } from "@/lib/api";
import { isCompletePhone, normalizePhoneDigits } from "@/lib/phone";
import {
  collectRegistrationContext,
  getGeoErrorMessage,
  tryCollectRegistrationContext,
  type RegistrationContext,
} from "@/lib/device-context";
import { toastError } from "@/lib/toast";
import { getErrorMessage, required } from "@/lib/validate";

type Step = "phone" | "name";

interface PhoneAuthFormProps {
  nextPath?: string;
  proximityTarget?: {
    placeId: string;
  };
}

export function PhoneAuthForm({
  nextPath = "/",
  proximityTarget,
}: PhoneAuthFormProps) {
  const { phoneSession } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [nameError, setNameError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [geoReady, setGeoReady] = useState(false);
  const geoContextRef = useRef<RegistrationContext | null>(null);
  const geoPromiseRef = useRef<Promise<RegistrationContext | null> | null>(null);

  const safeNext = nextPath.startsWith("/") ? nextPath : "/";

  function goNext() {
    setRedirecting(true);
    router.replace(safeNext);
  }

  useEffect(() => {
    if (step !== "name") return;

    let cancelled = false;
    setGeoReady(false);
    geoContextRef.current = null;

    const promise = tryCollectRegistrationContext();
    geoPromiseRef.current = promise;

    promise.then((context) => {
      if (cancelled) return;
      geoContextRef.current = context;
      setGeoReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [step]);

  async function resolveRegistrationContext(): Promise<RegistrationContext | undefined> {
    if (geoContextRef.current) return geoContextRef.current;

    if (geoPromiseRef.current) {
      const cached = await geoPromiseRef.current;
      if (cached) {
        geoContextRef.current = cached;
        return cached;
      }
    }

    if (proximityTarget) {
      return collectRegistrationContext();
    }

    return (await tryCollectRegistrationContext()) ?? undefined;
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isCompletePhone(phone)) {
      setPhoneError("Informe um celular com DDD");
      toastError("Celular inválido");
      return;
    }

    setLoading(true);
    setPhoneError(undefined);

    try {
      const normalized = normalizePhoneDigits(phone);
      await phoneSession({ phone: normalized });
      goNext();
    } catch (err) {
      if (err instanceof ApiError && err.code === "NEEDS_NAME") {
        setStep("name");
        return;
      }

      const message = getErrorMessage(err, "Não foi possível entrar com este celular");
      setPhoneError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameValidation = required(name, "Informe seu nome");
    if (nameValidation) {
      setNameError(nameValidation);
      toastError("Informe seu nome");
      return;
    }

    setLoading(true);
    setNameError(undefined);

    try {
      const normalized = normalizePhoneDigits(phone);
      let registrationContext: RegistrationContext | undefined;

      try {
        registrationContext = await resolveRegistrationContext();
      } catch (geoErr) {
        if (proximityTarget) {
          const message = getGeoErrorMessage(geoErr);
          setNameError(message);
          toastError(message);
          return;
        }
      }

      if (proximityTarget && !registrationContext) {
        const message = "Permita o acesso à localização para concluir o cadastro neste local";
        setNameError(message);
        toastError(message);
        return;
      }

      await phoneSession({
        phone: normalized,
        name: name.trim(),
        registrationContext,
        proximityTarget,
      });

      goNext();
    } catch (err) {
      const geoMessage = getGeoErrorMessage(err);
      const message = getErrorMessage(err, geoMessage);
      setNameError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  if (redirecting) {
    return <Spin fullScreen loop={false} label="Entrando..." />;
  }

  const registerLoadingLabel = proximityTarget
    ? !geoReady
      ? "Obtendo localização..."
      : "Criando conta..."
    : "Criando conta...";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex min-h-screen flex-col bg-background px-6 py-8 sm:px-10 lg:items-center lg:justify-center lg:px-12">
        <AuthLogo className="mb-8 self-start lg:hidden" />

        <div className="flex w-full max-w-[360px] flex-1 flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-[18px] font-semibold tracking-tight text-accent-dark">
              {step === "phone" ? "Entre com seu celular" : "Quase lá!"}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {step === "phone"
                ? "Sem senha e sem código. Só o número do celular."
                : proximityTarget
                  ? "Seu nome e a localização no local — precisamos confirmar que você está perto."
                  : "Como podemos te chamar? Rápido e sem burocracia."}
            </p>
          </div>

          {step === "phone" ? (
            <form
              onSubmit={handlePhoneSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <PhoneInput
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  if (phoneError) setPhoneError(undefined);
                }}
                error={phoneError}
                required
              />
              <Button type="submit" fullWidth disabled={loading} className="mt-1">
                {loading ? "Entrando..." : "Continuar"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <PhoneInput value={phone} onChange={() => {}} disabled />
              <Input
                label="Seu nome"
                value={name}
                error={nameError}
                autoComplete="name"
                autoFocus
                placeholder="Como você quer aparecer"
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(undefined);
                }}
                required
              />
              {proximityTarget ? (
                <p className="text-xs leading-relaxed text-muted">
                  {geoReady
                    ? "Localização pronta. Você precisa estar a até 100 m do local."
                    : "Aguardando permissão de localização em segundo plano…"}
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-muted">
                  A localização é opcional e ajuda a melhorar o serviço na região.
                </p>
              )}
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? registerLoadingLabel : "Criar conta e entrar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setStep("phone");
                  setName("");
                  setNameError(undefined);
                  geoContextRef.current = null;
                  geoPromiseRef.current = null;
                  setGeoReady(false);
                }}
              >
                Voltar
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            Gestor ou admin?{" "}
            <Link
              href={`/acesso-profissional?next=${encodeURIComponent(safeNext)}`}
              className="font-medium text-accent hover:underline"
            >
              Entrar com e-mail
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <LoginShowcase />
      </div>
    </div>
  );
}
