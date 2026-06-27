"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { isCompletePhone, normalizePhoneDigits } from "@/lib/phone";
import {
  collectRegistrationContext,
  getGeoErrorMessage,
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
      const check = await api.auth.phoneCheck(normalized);

      if (check.exists) {
        await phoneSession({ phone: normalized });
        router.replace(nextPath.startsWith("/") ? nextPath : "/");
        return;
      }

      setStep("name");
    } catch (err) {
      const message = getErrorMessage(err, "Não foi possível verificar o celular");
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
      const registrationContext = await collectRegistrationContext();
      const normalized = normalizePhoneDigits(phone);

      await phoneSession({
        phone: normalized,
        name: name.trim(),
        registrationContext,
        proximityTarget,
      });

      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    } catch (err) {
      const geoMessage = getGeoErrorMessage(err);
      const message = getErrorMessage(err, geoMessage);
      setNameError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

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
                : "Como podemos te chamar? Vamos usar sua localização só para registrar de onde você entrou."}
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
                {loading ? "Verificando..." : "Continuar"}
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
                placeholder="Como você quer aparecer"
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(undefined);
                }}
                required
              />
              <p className="text-xs leading-relaxed text-muted">
                Ao continuar, coletamos sua localização, rede e informações básicas
                do dispositivo para registrar de onde você entrou.
                {proximityTarget &&
                  " Você precisa estar a até 100m do local para concluir o cadastro."}
              </p>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta e entrar"}
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
                }}
              >
                Voltar
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            Gestor ou admin?{" "}
            <Link
              href={`/acesso-profissional?next=${encodeURIComponent(nextPath)}`}
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
