import {
  Bell,
  ChatCircleDots,
  House,
  MapPin,
  Plus,
  QrCode,
  SquaresFour,
  Tag,
  User,
  Users,
  type Icon,
} from "@phosphor-icons/react";
import type { UserRole } from "@/lib/types";
import type { NavTone } from "@/lib/nav-tones";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  match: (pathname: string) => boolean;
  tone?: NavTone;
};

const turistaNav: NavItem[] = [
  {
    href: "/",
    label: "Início",
    icon: House,
    match: (p) => p === "/",
  },
  {
    href: "/locais",
    label: "Locais",
    icon: MapPin,
    match: (p) =>
      p.startsWith("/locais") &&
      !p.includes("/editar") &&
      p !== "/locais/novo" &&
      !/\/locais\/[^/]+\/(sinalizar|elogiar)/.test(p),
  },
  {
    href: "/sinalizar",
    label: "Novo sinal",
    icon: QrCode,
    match: (p) => p.startsWith("/sinalizar"),
    tone: "signal",
  },
  {
    href: "/minhas-sinalizacoes",
    label: "Sinais",
    icon: ChatCircleDots,
    match: (p) => p.startsWith("/minhas-sinalizacoes"),
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
    match: (p) => p.startsWith("/perfil") || p.startsWith("/favoritos"),
  },
];

const gestorNav: NavItem[] = [
  {
    href: "/gestor/locais",
    label: "Início",
    icon: SquaresFour,
    match: (p) =>
      p.startsWith("/gestor/locais") ||
      /\/locais\/[^/]+\/editar/.test(p),
  },
  {
    href: "/gestor/sinalizacoes",
    label: "Alertas",
    icon: Bell,
    match: (p) => p.startsWith("/gestor/sinalizacoes"),
  },
  {
    href: "/locais/novo",
    label: "Novo",
    icon: Plus,
    match: (p) => p === "/locais/novo",
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
    match: (p) => p.startsWith("/perfil"),
  },
];

const adminNav: NavItem[] = [
  {
    href: "/gestor/locais",
    label: "Locais",
    icon: MapPin,
    match: (p) =>
      p.startsWith("/gestor/locais") ||
      p === "/locais/novo" ||
      /\/locais\/[^/]+\/editar/.test(p),
  },
  {
    href: "/categorias",
    label: "Categorias",
    icon: Tag,
    match: (p) => p.startsWith("/categorias"),
  },
  {
    href: "/admin/usuarios",
    label: "Usuários",
    icon: Users,
    match: (p) => p.startsWith("/admin/"),
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
    match: (p) => p.startsWith("/perfil"),
  },
];

export function getNavItems(role: UserRole | null | undefined): NavItem[] {
  switch (role) {
    case "GESTOR":
      return gestorNav;
    case "ADMIN":
      return adminNav;
    default:
      return turistaNav;
  }
}
