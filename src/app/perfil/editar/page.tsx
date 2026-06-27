"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { toastError } from "@/lib/toast";
import { getErrorMessage, minLength } from "@/lib/validate";

export default function EditarPerfilPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  useEffect(() => {
    if (!user) {
      router.replace("/perfil");
      return;
    }
    setName(user.name);
  }, [user, router]);

  if (!user) {
    return null;
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setMessage("");
    setPasswordError(undefined);

    const trimmedName = name.trim();
    const nameChanged = trimmedName && trimmedName !== user.name;

    if (!nameChanged && !password) {
      toastError("Altere o nome ou informe uma nova senha");
      return;
    }

    if (password) {
      const validation = minLength(
        password,
        6,
        "A senha deve ter pelo menos 6 caracteres",
      );
      if (validation) {
        setPasswordError(validation);
        toastError("Verifique os campos destacados");
        return;
      }
    }

    setLoading(true);
    try {
      await api.users.updateProfile({
        ...(nameChanged ? { name: trimmedName } : {}),
        ...(password ? { password } : {}),
      });
      await refresh();
      setMessage("Perfil atualizado com sucesso");
      setPassword("");
    } catch (err) {
      const msg = getErrorMessage(err, "Erro ao atualizar");
      toastError(msg);
      setPasswordError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Editar perfil"
        subtitle="Atualize seus dados de acesso"
        backHref="/perfil"
      />

      <form onSubmit={handleUpdate} className="flex flex-col gap-4" noValidate>
        <Input
          label="Seu nome"
          placeholder="Digite aqui seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Seu e-mail"
          type="email"
          value={user.email ?? ""}
          disabled
        />
        <p className="-mt-2 text-xs text-muted">O e-mail não pode ser alterado</p>
        <Input
          label="Sua nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="Deixe em branco para manter a atual"
          value={password}
          error={passwordError}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(undefined);
          }}
        />
        {message && <p className="text-sm text-muted">{message}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
