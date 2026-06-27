"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toastError } from "@/lib/toast";
import { getErrorMessage, isEmail, required } from "@/lib/validate";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function AcessoProfissionalPage() {
  return (
    <Suspense fallback={null}>
      <ProfessionalLoginForm />
    </Suspense>
  );
}

function ProfessionalLoginForm() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    }
  }, [authLoading, user, router, nextPath]);

  if (authLoading || user) {
    return null;
  }

  function validate() {
    const next: LoginErrors = {
      email: required(email, "Informe seu e-mail"),
      password: required(password, "Informe sua senha"),
    };

    if (!next.email && !isEmail(email)) {
      next.email = "Digite um e-mail válido";
    }

    const filtered = Object.fromEntries(
      Object.entries(next).filter(([, value]) => value),
    ) as LoginErrors;

    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toastError("Verifique os campos destacados");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    } catch (err) {
      const message = getErrorMessage(err, "Erro ao entrar");
      toastError(message);
      setErrors({ password: message });
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
              Acesso profissional
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Entrada para gestores e administradores com e-mail e senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Seu e-mail"
              type="email"
              autoComplete="email"
              value={email}
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              required
            />
            <Input
              label="Sua senha"
              type="password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              required
            />
            <Button type="submit" fullWidth disabled={loading} className="mt-1">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            É turista?{" "}
            <Link
              href={`/entrar?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-accent hover:underline"
            >
              Entrar com celular
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
