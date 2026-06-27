"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type { User, UserRole } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchField } from "@/components/ui/SearchField";
import { FilterPills } from "@/components/ui/FilterPills";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spin } from "@/components/ui/Spin";
import {
  UserRoleBadge,
  userInitials,
} from "@/components/admin/UserRoleBadge";
import { UserDetailSideModal } from "@/components/admin/UserDetailSideModal";
import { formatRelativeDate } from "@/lib/format-date";
import { cn } from "@/lib/cn";

type RoleFilter = UserRole | "all";

export default function AdminUsuariosPage() {
  const { canManageUsers, user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    if (!canManageUsers) {
      router.replace("/perfil");
      return;
    }
    api.users
      .list()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [canManageUsers, router]);

  const roleCounts = useMemo(() => {
    const counts: Record<UserRole, number> = {
      TURISTA: 0,
      GESTOR: 0,
      ADMIN: 0,
    };
    for (const user of users) counts[user.role] += 1;
    return counts;
  }, [users]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term.replace(/\D/g, ""))
      );
    });
  }, [users, search, roleFilter]);

  const roleOptions = useMemo(
    () => [
      { value: "all" as const, label: "Todos", count: users.length },
      {
        value: "TURISTA" as const,
        label: "Turistas",
        count: roleCounts.TURISTA,
      },
      {
        value: "GESTOR" as const,
        label: "Gestores",
        count: roleCounts.GESTOR,
      },
      {
        value: "ADMIN" as const,
        label: "Admins",
        count: roleCounts.ADMIN,
      },
    ],
    [users.length, roleCounts],
  );

  function handleUpdated(updated: User) {
    setUsers((prev) =>
      prev.map((user) => (user.id === updated.id ? updated : user)),
    );
    setSelected(updated);
  }

  return (
    <div>
      <PageHeader
        title="Usuários"
        subtitle={`${users.length} cadastrados na plataforma`}
      />

      <div className="mb-4 grid grid-cols-3 gap-2">
        {(
          [
            { label: "Turistas", value: roleCounts.TURISTA },
            { label: "Gestores", value: roleCounts.GESTOR },
            { label: "Admins", value: roleCounts.ADMIN },
          ] as const
        ).map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-surface px-3 py-3 text-center"
          >
            <p className="text-lg font-semibold text-accent-dark">
              {item.value}
            </p>
            <p className="text-[11px] font-medium text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou e-mail"
        />
        <FilterPills
          options={roleOptions}
          value={roleFilter}
          onChange={setRoleFilter}
        />
      </div>

      {loading ? (
        <Spin size="sm" loop={false} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="Tag"
          title="Nenhum usuário encontrado"
          description="Tente outro termo ou limpe os filtros."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-surface-subtle px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span className="w-9" aria-hidden />
            <span>Usuário</span>
            <span className="text-right">Perfil</span>
          </div>

          <div role="list">
            {filtered.map((user, index) => (
              <button
                key={user.id}
                type="button"
                role="listitem"
                onClick={() => setSelected(user)}
                className={cn(
                  "grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 text-left transition",
                  "hover:bg-surface-hover active:bg-surface-hover",
                  index < filtered.length - 1 && "border-b border-border",
                  selected?.id === user.id && "bg-accent/5",
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {userInitials(user.name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-accent-dark">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="ml-1.5 text-xs font-normal text-muted">
                        (você)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {user.phone ?? user.email ?? "Sem contato"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted/80">
                    {formatRelativeDate(user.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <UserRoleBadge role={user.role} />
                  <CaretRight
                    size={14}
                    weight="bold"
                    className="shrink-0 text-muted"
                    aria-hidden
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <UserDetailSideModal
        user={selected}
        open={selected != null}
        onClose={() => setSelected(null)}
        currentUserId={currentUser?.id}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
