"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChatCircleDots,
  Clock,
  Eye,
  GlobeHemisphereWest,
  MapPin,
  QrCode,
  Sun,
  Target,
  Users,
  Warning,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import {
  DemoSlideLayout,
  MockGestorAlertsScreen,
  MockHomeScreen,
  MockMySignalsScreen,
  MockPlaceDetailScreen,
  MockPlacesScreen,
  MockSignalScreen,
} from "@/components/apresentacao/ApresentacaoMockScreens";

type SlideTone = "dark" | "light" | "accent";

type Slide = {
  id: string;
  render: () => React.ReactNode;
};

const toneStyles: Record<
  SlideTone,
  { bg: string; text: string; muted: string; step: string; eyebrow: string }
> = {
  dark: {
    bg: "bg-[#1b2d3a]",
    text: "text-white",
    muted: "text-white/70",
    step: "bg-[#e17b21] text-white",
    eyebrow: "text-[#e17b21]",
  },
  light: {
    bg: "bg-[#f5f5f7]",
    text: "text-[#1b2d3a]",
    muted: "text-[#86868b]",
    step: "bg-[#e17b21] text-white",
    eyebrow: "text-[#e17b21]",
  },
  accent: {
    bg: "bg-[#e17b21]",
    text: "text-white",
    muted: "text-white/85",
    step: "bg-white/20 text-white",
    eyebrow: "text-white/80",
  },
};

function SlideShell({
  tone,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  tone: SlideTone;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const s = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex h-full min-h-[100dvh] w-full flex-col px-6 py-10 sm:px-12 sm:py-14",
        s.bg,
        s.text,
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
        {eyebrow && (
          <p className={cn("text-xs font-bold tracking-[0.2em] uppercase", s.eyebrow)}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={cn("mt-3 max-w-2xl text-base leading-relaxed sm:text-lg", s.muted)}>
            {subtitle}
          </p>
        )}
        <div className={title || subtitle || eyebrow ? "mt-8" : ""}>{children}</div>
      </div>
    </div>
  );
}

function StepList({
  items,
  tone,
}: {
  items: { n: number; text: string }[];
  tone: SlideTone;
}) {
  const s = toneStyles[tone];

  return (
    <ol className="flex flex-col gap-3 sm:gap-4">
      {items.map((item) => (
        <li key={item.n} className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              s.step,
            )}
          >
            {item.n}
          </span>
          <span className={cn("pt-1 text-sm leading-relaxed sm:text-base", s.muted)}>
            {item.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    render: () => (
      <SlideShell tone="accent" className="text-center">
        <div className="flex flex-col items-center gap-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase ring-1 ring-white/30">
            <Sun size={16} weight="fill" />
            Hackathon do Sol
          </span>

          <Image
            src="/logo.svg"
            alt="Rota Potiguar"
            width={280}
            height={60}
            priority
            className="h-auto w-full max-w-[260px] brightness-0 invert sm:max-w-[300px]"
          />

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Rota Potiguar</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed opacity-90 sm:text-xl">
              Sistema de recuperação de experiência turística no Rio Grande do Norte.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 px-6 py-4 ring-1 ring-white/25">
            <p className="text-sm font-bold">Equipe Bravos</p>
            <p className="mt-1 text-xs tracking-wide opacity-85 uppercase">
              Trilha Turismo · Eixo 1
            </p>
            <p className="mt-3 text-sm opacity-90">Clayton · Igor · Kevem · Nonato</p>
          </div>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "problematizacao",
    render: () => (
      <SlideShell
        tone="dark"
        eyebrow="Problematização"
        title="Faltou um canal na hora certa."
        subtitle="Exemplo vivido: você está no ponto turístico, algo não funciona — e não há como avisar quem pode resolver naquele momento."
      >
        <div className="rounded-2xl bg-white/8 p-5 ring-1 ring-white/10 sm:p-6">
          <p className="text-sm leading-relaxed opacity-90 sm:text-base">
            O turista precisa reclamar em rede social, ligar para um número genérico ou simplesmente
            desistir. O problema some da memória — mas a experiência já foi perdida.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { icon: Warning, t: "Sem sinalização em tempo real", d: "Ninguém ouve no local, no momento." },
            { icon: Clock, t: "Resposta tardia", d: "O feedback chega tarde demais para recuperar." },
            { icon: ChatCircleDots, t: "Informação espalhada", d: "Outros turistas não sabem o que esperar." },
            { icon: Target, t: "Órgão sem visibilidade", d: "Entidade responsável não vê o que acontece no chão." },
          ].map((item) => (
            <div
              key={item.t}
              className="flex gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
            >
              <item.icon size={22} weight="duotone" className="shrink-0 opacity-80" />
              <div>
                <p className="text-sm font-bold">{item.t}</p>
                <p className="mt-0.5 text-xs opacity-70">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: "solucao",
    render: () => (
      <SlideShell
        tone="accent"
        eyebrow="Solução"
        title="Rota Potiguar"
        subtitle="Plataforma mobile-first para sinalizar, acompanhar e recuperar a experiência turística em tempo real."
      >
        <StepList
          tone="accent"
          items={[
            { n: 1, text: "Escaneia o QR Code ou entra na plataforma." },
            { n: 2, text: "Turista informa nome e telefone — cadastro rápido e prático." },
            { n: 3, text: "Sinaliza a experiência em tempo real no ponto cadastrado." },
            { n: 4, text: "Sinalização pública: outros turistas visualizam em tempo real." },
            { n: 5, text: "Entidade ou órgão responsável responde pelo sistema." },
            { n: 6, text: "Histórico visível mesmo depois de sanado — transparência para todos." },
          ]}
        />
      </SlideShell>
    ),
  },
  {
    id: "demo-home",
    render: () => (
      <DemoSlideLayout
        step="Na prática · 1/5"
        title="Entra na plataforma"
        subtitle="Turista acessa pelo celular, vê o mapa e os pontos cadastrados perto de si."
        screen={<MockHomeScreen />}
      />
    ),
  },
  {
    id: "demo-locais",
    render: () => (
      <DemoSlideLayout
        step="Na prática · 2/5"
        title="Escolhe o ponto"
        subtitle="Locais cadastrados com categoria, avaliação e distância — outros turistas também consultam."
        screen={<MockPlacesScreen />}
        tone="dark"
      />
    ),
  },
  {
    id: "demo-local",
    render: () => (
      <DemoSlideLayout
        step="Na prática · 3/5"
        title="QR Code no local"
        subtitle="No estabelecimento ou ponto turístico, escaneia o QR e confirma que está no local certo."
        screen={<MockPlaceDetailScreen />}
      />
    ),
  },
  {
    id: "demo-sinal",
    render: () => (
      <DemoSlideLayout
        step="Na prática · 4/5"
        title="Sinaliza em tempo real"
        subtitle="Nome e telefone já cadastrados — descreve o problema, envia foto e prioridade no momento."
        screen={<MockSignalScreen />}
        tone="dark"
      />
    ),
  },
  {
    id: "demo-resposta",
    render: () => (
      <DemoSlideLayout
        step="Na prática · 5/5"
        title="Resposta e transparência"
        subtitle="Órgão responsável responde pelo sistema. Turista acompanha — e o histórico fica visível mesmo após sanado."
        screen={
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <MockMySignalsScreen />
            <MockGestorAlertsScreen />
          </div>
        }
      />
    ),
  },
  {
    id: "objetivo",
    render: () => (
      <SlideShell
        tone="light"
        eyebrow="Objetivo"
        title="Experiência do turista em tempo real"
        subtitle="Rápido, prático e no momento em que o problema acontece."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Target,
              t: "Foco no turista",
              d: "Recuperar a experiência antes que vire reclamação pública.",
            },
            {
              icon: QrCode,
              t: "Rápido e prático",
              d: "QR no local, cadastro por telefone, sinal em poucos toques.",
            },
            {
              icon: Eye,
              t: "Transparência",
              d: "Sinais visíveis para outros visitantes — inclusive os já resolvidos.",
            },
            {
              icon: Bell,
              t: "Resposta institucional",
              d: "Entidade ou gestor responde pelo sistema, com registro.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <item.icon size={24} weight="duotone" className="text-accent" />
              <p className="mt-2 text-sm font-bold text-accent-dark">{item.t}</p>
              <p className="mt-1 text-xs text-muted">{item.d}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: "escalabilidade",
    render: () => (
      <SlideShell
        tone="dark"
        eyebrow="Escalabilidade"
        title="Todo o Rio Grande do Norte"
        subtitle="Produto pensado para escalar — começando onde a dor é mais visível."
      >
        <div className="flex flex-col gap-4">
          {[
            {
              icon: MapPin,
              step: "1",
              title: "Começa por Natal",
              text: "Piloto na capital, com pontos turísticos e estabelecimentos cadastrados.",
            },
            {
              icon: GlobeHemisphereWest,
              step: "2",
              title: "Expande para outros municípios",
              text: "Mesma plataforma, novos locais — litoral, sertão e interior do RN.",
            },
            {
              icon: Users,
              step: "3",
              title: "Rede de recuperação de experiência",
              text: "Turistas, gestores e órgãos públicos conectados em tempo real em todo o estado.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
                {item.step}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <item.icon size={20} weight="duotone" className="opacity-80" />
                  <p className="text-sm font-bold sm:text-base">{item.title}</p>
                </div>
                <p className="mt-1 text-xs leading-relaxed opacity-75 sm:text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: "obrigado",
    render: () => (
      <SlideShell tone="accent" className="text-center">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/logo.svg"
            alt="Rota Potiguar"
            width={220}
            height={48}
            className="h-auto w-[200px] brightness-0 invert"
          />
          <h2 className="text-3xl font-bold sm:text-5xl">Obrigado!</h2>
          <p className="max-w-md text-base opacity-80 sm:text-lg">
            Rota Potiguar · Hackathon do Sol · Rio Grande do Norte
          </p>
          <div className="text-center">
            <p className="text-sm font-semibold opacity-90">Equipe Bravos · Trilha Turismo · Eixo 1</p>
            <p className="mt-2 text-sm opacity-75">Clayton · Igor · Kevem · Nonato</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <Image
                src="/qrpraia.png"
                alt="QR Code — Rota Potiguar"
                width={160}
                height={160}
                className="h-36 w-36 object-contain sm:h-40 sm:w-40"
              />
            </div>
            <p className="text-xs opacity-70">Escaneie para acessar a plataforma</p>
          </div>

          <p className="text-sm opacity-60">Perguntas?</p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1b2d3a] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Abrir a plataforma
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </SlideShell>
    ),
  },
];

export function ApresentacaoContent() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
    },
    [total],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setIndex(total - 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  return (
    <div className="presentation-deck fixed inset-0 z-50 min-h-[100dvh] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((s) => (
          <div key={s.id} className="h-[100dvh] w-full shrink-0">
            {s.render()}
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-white backdrop-blur-md">
          <Clock size={14} weight="duotone" />
          <span className="text-xs font-medium">
            {index + 1} / {total}
          </span>
        </div>

        <div className="pointer-events-auto flex gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Slide anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 disabled:opacity-30"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === total - 1}
            aria-label="Próximo slide"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 disabled:opacity-30"
          >
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-16 z-30 flex justify-center gap-1.5 px-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-[#e17b21]" : "w-1.5 bg-black/25 hover:bg-black/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
