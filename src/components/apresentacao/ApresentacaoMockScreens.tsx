"use client";

import Image from "next/image";
import {
  Bell,
  ChatCircleDots,
  ForkKnife,
  Heart,
  House,
  MapPin,
  QrCode,
  User,
  Warning,
} from "@phosphor-icons/react";
import { CategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/cn";

export function PhoneFrame({
  children,
  className,
  active = "home",
}: {
  children: React.ReactNode;
  className?: string;
  active?: "home" | "places" | "signal" | "signals" | "profile";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[280px] rounded-[2rem] border-[6px] border-[#1b2d3a]/90 bg-[#1b2d3a] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,.35)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.4rem] bg-[#f5f5f7]">
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <span className="text-[10px] font-semibold text-[#1b2d3a]">9:41</span>
          <div className="h-4 w-16 rounded-full bg-[#1b2d3a]/90" />
          <span className="text-[10px] font-semibold text-[#1b2d3a]">100%</span>
        </div>
        <div className="max-h-[420px] overflow-hidden">{children}</div>
        <MockBottomNav active={active} />
      </div>
    </div>
  );
}

function MockBottomNav({ active = "home" }: { active?: "home" | "places" | "signal" | "signals" | "profile" }) {
  const items = [
    { id: "home" as const, icon: House, label: "Início" },
    { id: "places" as const, icon: MapPin, label: "Locais" },
    { id: "signal" as const, icon: QrCode, label: "Novo sinal" },
    { id: "signals" as const, icon: ChatCircleDots, label: "Sinais" },
    { id: "profile" as const, icon: User, label: "Perfil" },
  ];

  return (
    <div className="border-t border-border bg-glass-bg px-2 py-2 backdrop-blur-md">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = item.id === active;
          const isSignal = item.id === "signal";

          return (
            <div key={item.id} className="flex flex-col items-center gap-0.5 px-1">
              <span
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-full px-2 py-1",
                  isSignal && "bg-accent/15 ring-1 ring-accent/25",
                  isActive && !isSignal && "nav-glass-btn",
                )}
              >
                <item.icon
                  size={16}
                  weight={isActive ? "fill" : "duotone"}
                  className={cn(
                    isSignal ? "text-accent" : isActive ? "text-accent-dark" : "text-muted",
                  )}
                />
                <span
                  className={cn(
                    "text-[8px] leading-none",
                    isSignal
                      ? "font-semibold text-accent"
                      : isActive
                        ? "font-semibold text-accent-dark"
                        : "text-muted",
                  )}
                >
                  {item.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MapMock() {
  const pins = [
    { top: "22%", left: "35%", icon: "ForkKnife" },
    { top: "45%", left: "58%", icon: "MapPin" },
    { top: "62%", left: "28%", icon: "Bed" },
    { top: "38%", left: "72%", icon: "Tree" },
  ];

  return (
    <div className="relative h-32 overflow-hidden rounded-xl border border-border bg-[#e8eef2]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(#c5d4de 1px, transparent 1px), linear-gradient(90deg, #c5d4de 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-md" />
      {pins.map((pin) => (
        <div
          key={`${pin.top}-${pin.left}`}
          className="absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent bg-surface text-accent shadow-sm"
          style={{ top: pin.top, left: pin.left }}
        >
          <CategoryIcon name={pin.icon} size={12} weight="fill" />
        </div>
      ))}
      <div className="absolute right-2 bottom-2 rounded-md bg-white/80 px-1.5 py-0.5 text-[8px] text-muted">
        © CARTO
      </div>
    </div>
  );
}

export function MockHomeScreen() {
  return (
    <PhoneFrame>
      <div className="space-y-3 px-4 pb-3">
        <div>
          <p className="text-[10px] text-muted">Rota Potiguar</p>
          <p className="text-sm font-semibold text-accent-dark">Boa tarde, Maria</p>
          <p className="text-[10px] text-muted">O que você quer explorar hoje?</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-end justify-between">
            <p className="text-[11px] font-semibold text-accent-dark">Perto de você</p>
            <span className="text-[9px] font-semibold text-accent">Ver todos</span>
          </div>
          <p className="mb-2 text-[9px] text-muted">Ponta Negra, Natal — RN</p>
          <MapMock />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold text-accent-dark">Acesso rápido</p>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "Locais", cls: "bg-sky-500/15 text-sky-600" },
              { label: "Favoritos", cls: "bg-rose-500/15 text-rose-500" },
              { label: "Novo sinal", cls: "bg-accent/15 text-accent" },
              { label: "Sinais", cls: "bg-amber-500/15 text-amber-600" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-1.5"
              >
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", item.cls)}>
                  <MapPin size={14} weight="duotone" />
                </span>
                <span className="text-center text-[7px] font-semibold text-accent-dark">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

const MOCK_PLACES = [
  { name: "Camarões Potiguar", cat: "Alimentação", icon: "ForkKnife", dist: "1,5 km", rating: 4.8 },
  { name: "Praia do Meio", cat: "Natureza", icon: "Tree", dist: "4,2 km", rating: 4.6 },
  { name: "Arena das Dunas", cat: "Ponto Turístico", icon: "MapPin", dist: "2,9 km", rating: 4.9 },
  { name: "Centro Histórico", cat: "Cultura", icon: "MaskHappy", dist: "3,4 km", rating: 4.7 },
];

export function MockPlacesScreen() {
  return (
    <PhoneFrame>
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold text-accent-dark">Locais</p>
        <p className="text-[10px] text-muted">Descubra o melhor do RN</p>
        <div className="mt-3 rounded-xl border border-border bg-input-bg px-3 py-2 text-[10px] text-muted">
          Buscar locais…
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {MOCK_PLACES.map((place) => (
            <div
              key={place.name}
              className="flex gap-2.5 rounded-xl border border-border bg-surface p-2.5 shadow-soft"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <CategoryIcon name={place.icon} size={20} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-accent-dark">{place.name}</p>
                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[8px] font-medium text-accent">
                  <CategoryIcon name={place.icon} size={8} weight="fill" />
                  {place.cat}
                </span>
                <p className="mt-1 text-[9px] text-muted">
                  ★ {place.rating} · {place.dist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MockPlaceDetailScreen() {
  return (
    <PhoneFrame>
      <div className="px-4 pb-3">
        <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50">
          <ForkKnife size={40} weight="duotone" className="text-accent" />
        </div>
        <p className="text-sm font-semibold text-accent-dark">Camarões Potiguar</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent">
          <ForkKnife size={10} weight="fill" />
          Alimentação
        </span>
        <p className="mt-1 text-[10px] text-muted">★ 4,8 · 127 avaliações · Aberto agora</p>
        <p className="mt-2 flex items-start gap-1 text-[9px] text-muted">
          <MapPin size={11} weight="fill" className="mt-0.5 shrink-0 text-accent" />
          Av. Eng. Roberto Freire, 2610 — Ponta Negra, Natal
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-accent/25 bg-accent/10 py-2.5 text-[10px] font-semibold text-accent">
            <QrCode size={14} weight="duotone" />
            Sinalizar
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-[10px] font-semibold text-accent-dark">
            <Heart size={14} weight="duotone" />
            Favoritar
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MockSignalScreen() {
  return (
    <PhoneFrame active="signal">
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold text-accent-dark">Novo sinal</p>
        <p className="text-[10px] text-muted">Camarões Potiguar · você está a 45 m</p>

        <div className="mt-3 flex flex-col items-center rounded-xl border border-dashed border-accent/40 bg-accent/5 py-5">
          <QrCode size={48} weight="duotone" className="text-accent" />
          <p className="mt-2 text-[10px] font-semibold text-accent-dark">QR escaneado</p>
          <p className="text-[9px] text-muted">Local confirmado por GPS</p>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-[10px] font-semibold text-accent-dark">Descreva o problema</p>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-[10px] text-muted">
            Banheiro precisando de limpeza urgente…
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[9px] font-semibold text-amber-600">
              Média prioridade
            </span>
            <span className="rounded-full bg-surface px-2.5 py-1 text-[9px] text-muted ring-1 ring-border">
              📷 1 foto
            </span>
          </div>
          <div className="rounded-xl bg-accent py-2.5 text-center text-[11px] font-bold text-on-accent">
            Enviar sinal
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MockMySignalsScreen() {
  return (
    <PhoneFrame active="signals">
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold text-accent-dark">Minhas sinalizações</p>
        <p className="text-[10px] text-muted">Acompanhe respostas dos gestores</p>

        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-border bg-surface p-3 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-accent-dark">Camarões Potiguar</p>
                <p className="mt-0.5 text-[9px] text-muted">Hoje, 14:32</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
                Respondido
              </span>
            </div>
            <p className="mt-2 text-[10px] text-muted">Banheiro precisando de limpeza urgente</p>
            <div className="mt-2 rounded-lg bg-surface-subtle px-2.5 py-2">
              <p className="text-[9px] font-semibold text-accent-dark">Resposta do gestor</p>
              <p className="mt-0.5 text-[9px] text-muted">
                Obrigado! Equipe acionada. Previsão de resolução em 20 min.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 opacity-70">
            <p className="text-[11px] font-semibold text-accent-dark">Praia do Meio</p>
            <p className="mt-1 text-[9px] text-muted">Lixeira cheia na orla</p>
            <span className="mt-2 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[8px] font-semibold text-amber-600">
              Aguardando
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MockGestorAlertsScreen() {
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[2rem] border-[6px] border-accent-dark/90 bg-accent-dark p-1.5 shadow-[0_24px_60px_rgba(0,0,0,.35)]">
      <div className="overflow-hidden rounded-[1.4rem] bg-background">
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <span className="text-[10px] font-semibold text-accent-dark">9:41</span>
          <div className="h-4 w-16 rounded-full bg-accent-dark/90" />
          <span className="text-[10px] font-semibold text-accent-dark">100%</span>
        </div>
        <div className="max-h-[420px] px-4 pb-3">
          <p className="text-sm font-semibold text-accent-dark">Alertas</p>
          <p className="text-[10px] text-muted">Praia Mar · Gestor</p>

          <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2">
              <Warning size={18} weight="fill" className="text-amber-600" />
              <div>
                <p className="text-[11px] font-bold text-accent-dark">Novo sinal — Camarões Potiguar</p>
                <p className="text-[9px] text-muted">Há 2 min · Prioridade média</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted">Banheiro precisando de limpeza urgente</p>
            <p className="mt-1 text-[9px] text-muted">Maria · a 45 m do local</p>
            <div className="mt-2 rounded-lg bg-accent py-2 text-center text-[10px] font-bold text-on-accent">
              Responder visitante
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-muted" />
              <p className="text-[10px] font-semibold text-accent-dark">Sinal resolvido — ontem</p>
            </div>
            <p className="mt-1 text-[9px] text-muted">Ar-condicionado com problema · respondido</p>
          </div>
        </div>
        <div className="border-t border-border bg-glass-bg px-3 py-2">
          <div className="flex justify-around text-[8px] text-muted">
            <span className="font-semibold text-accent-dark">Início</span>
            <span className="font-semibold text-accent">Alertas</span>
            <span>Novo</span>
            <span>Perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoSlideLayout({
  step,
  title,
  subtitle,
  screen,
  tone = "light",
}: {
  step: string;
  title: string;
  subtitle?: string;
  screen: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6 py-10 sm:flex-row sm:gap-12 sm:px-12",
        tone === "dark" ? "bg-[#1b2d3a] text-white" : "bg-[#f5f5f7] text-[#1b2d3a]",
      )}
    >
      <div className="max-w-sm shrink-0 text-center sm:text-left">
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase",
            tone === "dark" ? "bg-white/10 text-white/80" : "bg-[#e17b21]/10 text-[#e17b21]",
          )}
        >
          {step}
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed sm:text-base",
              tone === "dark" ? "text-white/70" : "text-[#86868b]",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="shrink-0">{screen}</div>
    </div>
  );
}
