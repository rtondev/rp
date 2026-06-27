"use client";

import { useEffect, useState } from "react";
import { CalendarBlank, EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ROLE_LABELS, type User, type UserRole } from "@/lib/types";
import { formatFullDate, formatRelativeDate } from "@/lib/format-date";
import { formatPhoneDisplay } from "@/lib/phone";
import { SideModal } from "@/components/ui/SideModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { UserRoleBadge, userInitials } from "@/components/admin/UserRoleBadge";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";

interface UserDetailSideModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  currentUserId?: string;
  onUpdated: (user: User) => void;
}

export function UserDetailSideModal({
  user,
  open,
  onClose,
  currentUserId,
  onUpdated,
}: UserDetailSideModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("TURISTA");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setRole(user.role);
  }, [user]);

  if (!user) return null;

  const isSelf = user.id === currentUserId;
  const nameChanged = name.trim() !== user.name;
  const roleChanged = role !== user.role;
  const hasChanges = nameChanged || roleChanged;

  async function handleSave() {
    if (!user || !hasChanges) return;

    const payload: { name?: string; role?: UserRole } = {};
    if (nameChanged) payload.name = name.trim();
    if (roleChanged) payload.role = role;

    if (nameChanged && !payload.name) {
      toastError("Informe um nome válido");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.users.update(user.id, payload);
      onUpdated(updated);
      toast.success("Usuário atualizado");
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao salvar usuário"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SideModal
      open={open}
      onClose={onClose}
      title={user.name}
      subtitle="Detalhes e permissões"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-subtle px-4 py-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-xl font-semibold text-accent">
            {userInitials(user.name)}
          </div>
          <p className="mt-3 font-semibold text-accent-dark">{user.name}</p>
          <p className="mt-0.5 text-sm text-muted">
            {user.phone ? formatPhoneDisplay(user.phone) : user.email}
          </p>
          <UserRoleBadge role={user.role} className="mt-3" />
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <Select
            label="Perfil de acesso"
            value={role}
            disabled={saving}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={(
              Object.entries(ROLE_LABELS) as [UserRole, string][]
            ).map(([value, label]) => ({ value, label }))}
          />

          {isSelf && (
            <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-800">
              Este é o seu usuário. Você não pode remover seu perfil de
              administrador.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-subtle p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Informações
          </p>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3">
              <EnvelopeSimple
                size={18}
                weight="duotone"
                className="mt-0.5 shrink-0 text-muted"
              />
              <div className="min-w-0">
                <dt className="text-xs text-muted">E-mail</dt>
                <dd className="truncate font-medium text-accent-dark">
                  {user.email}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                weight="duotone"
                className="mt-0.5 shrink-0 text-muted"
              />
              <div>
                <dt className="text-xs text-muted">Perfil atual</dt>
                <dd className="font-medium text-accent-dark">
                  {ROLE_LABELS[user.role]}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarBlank
                size={18}
                weight="duotone"
                className="mt-0.5 shrink-0 text-muted"
              />
              <div>
                <dt className="text-xs text-muted">Cadastro</dt>
                <dd className="font-medium text-accent-dark">
                  {formatFullDate(user.createdAt)}
                </dd>
                <dd className="text-xs text-muted">
                  {formatRelativeDate(user.createdAt)}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <Button
          fullWidth
          disabled={!hasChanges || saving}
          onClick={handleSave}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </SideModal>
  );
}
