"use client";

import Link from "next/link";
import {
  Bell,
  ChatCircleDots,
  Heart,
  MapPin,
  Plus,
  QrCode,
  SignIn,
  Tag,
  Users,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { formatHomeGreeting } from "@/lib/greeting";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/cn";
import { HomeLastSignal } from "@/components/home/HomeLastSignal";

type QuickItem = {
  href: string;
  label: string;
  icon: Icon;
  iconClassName: string;
  tileClassName?: string;
};

function QuickTile({ href, label, icon: IconComponent, iconClassName, tileClassName }: QuickItem) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-2 py-4 transition active:scale-[0.97] hover:bg-surface-hover",
        tileClassName,
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl",
          iconClassName,
        )}
      >
        <IconComponent size={24} weight="duotone" />
      </span>
      <span className="text-center text-xs font-semibold text-accent-dark">
        {label}
      </span>
    </Link>
  );
}

function getQuickItems(role: UserRole | null | undefined): QuickItem[] {
  if (!role) {
    return [
      {
        href: "/locais",
        label: "Locais",
        icon: MapPin,
        iconClassName: "bg-accent/15 text-accent",
      },
      {
        href: "/entrar",
        label: "Entrar",
        icon: SignIn,
        iconClassName: "bg-accent/15 text-accent",
      },
    ];
  }

  if (role === "TURISTA") {
    return [
      {
        href: "/locais",
        label: "Locais",
        icon: MapPin,
        iconClassName: "bg-accent/15 text-accent",
      },
      {
        href: "/favoritos",
        label: "Favoritos",
        icon: Heart,
        iconClassName: "bg-rose-500/15 text-rose-500",
      },
      {
        href: "/sinalizar",
        label: "Novo sinal",
        icon: QrCode,
        iconClassName: "bg-violet-500/15 text-violet-600",
      },
      {
        href: "/minhas-sinalizacoes",
        label: "Sinais",
        icon: ChatCircleDots,
        iconClassName: "bg-amber-500/15 text-amber-600",
      },
    ];
  }

  if (role === "GESTOR") {
    return [
      {
        href: "/gestor/locais",
        label: "Meus locais",
        icon: MapPin,
        iconClassName: "bg-accent/15 text-accent",
      },
      {
        href: "/gestor/sinalizacoes",
        label: "Alertas",
        icon: Bell,
        iconClassName: "bg-amber-500/15 text-amber-600",
      },
      {
        href: "/locais/novo",
        label: "Novo local",
        icon: Plus,
        iconClassName: "bg-emerald-500/15 text-emerald-600",
      },
      {
        href: "/locais",
        label: "Explorar",
        icon: MapPin,
        iconClassName: "bg-sky-500/15 text-sky-600",
      },
    ];
  }

  return [
    {
      href: "/gestor/locais",
      label: "Locais",
      icon: MapPin,
      iconClassName: "bg-accent/15 text-accent",
    },
    {
      href: "/categorias",
      label: "Categorias",
      icon: Tag,
      iconClassName: "bg-violet-500/15 text-violet-600",
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: Users,
      iconClassName: "bg-emerald-500/15 text-emerald-600",
    },
  ];
}

function getSubtitle(role: UserRole | null | undefined): string {
  if (!role) return "Descubra o melhor do Rio Grande do Norte.";
  if (role === "ADMIN") return "Painel de administração da plataforma.";
  if (role === "GESTOR") return "Gerencie seus locais e acompanhe alertas.";
  return "O que você quer explorar hoje?";
}

export function HomeContent() {
  const { user } = useAuth();
  const items = getQuickItems(user?.role);

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-muted">Rota Potiguar</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-accent-dark">
          {formatHomeGreeting(user?.name)}
        </h1>
        <p className="mt-2 text-sm text-muted">{getSubtitle(user?.role)}</p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-accent-dark">
          Acesso rápido
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <QuickTile key={item.href} {...item} />
          ))}
        </div>
      </section>

      {user?.role === "TURISTA" && <HomeLastSignal mode="turista" />}
      {user?.role === "GESTOR" && <HomeLastSignal mode="gestor" />}
    </div>
  );
}
