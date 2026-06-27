"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flag, Heart, Star, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type HeartParticle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  delay: number;
  scale: number;
};

function createParticles(): HeartParticle[] {
  return Array.from({ length: 8 }, (_, index) => ({
    id: Date.now() + index,
    x: (Math.random() - 0.5) * 100,
    y: -(Math.random() * 70 + 24),
    rotate: (Math.random() - 0.5) * 60,
    delay: Math.random() * 0.12,
    scale: 0.5 + Math.random() * 0.6,
  }));
}

interface PlaceQuickActionsProps {
  placeId: string;
  isLoggedIn?: boolean;
  showFavorite?: boolean;
  favorited?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: () => Promise<void>;
  className?: string;
}

function ActionTile({
  label,
  icon: IconComponent,
  iconWeight = "duotone",
  iconClassName,
  tileClassName,
  onClick,
  href,
  disabled,
  children,
}: {
  label: string;
  icon: Icon;
  iconWeight?: "duotone" | "fill" | "regular";
  iconClassName?: string;
  tileClassName?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  const content = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        <IconComponent size={22} weight={iconWeight} />
      </span>
      <span className="text-xs font-semibold text-accent-dark">{label}</span>
      {children}
    </>
  );

  const className = cn(
    "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 transition active:scale-[0.97]",
    tileClassName,
    disabled && "pointer-events-none opacity-50",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}

export function PlaceQuickActions({
  placeId,
  isLoggedIn = false,
  showFavorite = false,
  favorited = false,
  favoriteLoading = false,
  onToggleFavorite,
  className,
}: PlaceQuickActionsProps) {
  const router = useRouter();
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const [popping, setPopping] = useState(false);

  const burst = useCallback(() => {
    setParticles(createParticles());
    setPopping(true);
    window.setTimeout(() => setParticles([]), 900);
    window.setTimeout(() => setPopping(false), 350);
  }, []);

  async function handleFavorite() {
    if (!onToggleFavorite || favoriteLoading) return;
    if (!favorited) burst();
    await onToggleFavorite();
  }

  function goLogin(path: string) {
    router.push(`/entrar?next=${encodeURIComponent(path)}`);
  }

  const cols = showFavorite ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={cn("grid gap-2", cols, className)}>
      {showFavorite && (
        <ActionTile
          label={favorited ? "Desfavoritar" : "Favoritar"}
          icon={Heart}
          iconWeight={favorited ? "fill" : "duotone"}
          onClick={
            onToggleFavorite
              ? handleFavorite
              : () => goLogin(`/locais/${placeId}`)
          }
          disabled={favoriteLoading}
          iconClassName={cn(
            "transition-transform duration-300",
            favorited
              ? "bg-rose-500/15 text-rose-500"
              : "bg-surface-hover text-muted",
            popping && "heart-pop",
            favorited && !popping && "scale-105",
          )}
          tileClassName={cn(
            "border-border bg-surface hover:bg-surface-hover",
            favorited && "border-rose-500/30 bg-rose-500/5",
          )}
        >
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="heart-fly pointer-events-none absolute top-1/2 left-1/2 z-10 text-rose-500"
              style={
                {
                  "--hx": `${particle.x}px`,
                  "--hy": `${particle.y}px`,
                  "--hr": `${particle.rotate}deg`,
                  "--hs": particle.scale,
                  animationDelay: `${particle.delay}s`,
                } as React.CSSProperties
              }
              aria-hidden
            >
              <Heart size={14} weight="fill" />
            </span>
          ))}
        </ActionTile>
      )}

      <ActionTile
        label="Sinalizar"
        icon={Flag}
        href={isLoggedIn ? `/locais/${placeId}/sinalizar` : undefined}
        onClick={
          isLoggedIn ? undefined : () => goLogin(`/locais/${placeId}/sinalizar`)
        }
        iconClassName="bg-amber-500/15 text-amber-600"
        tileClassName="border-amber-500/25 bg-amber-500/[0.08] hover:bg-amber-500/[0.12]"
      />

      <ActionTile
        label="Elogiar"
        icon={Star}
        href={isLoggedIn ? `/locais/${placeId}/elogiar` : undefined}
        onClick={
          isLoggedIn ? undefined : () => goLogin(`/locais/${placeId}/elogiar`)
        }
        iconClassName="bg-emerald-500/15 text-emerald-600"
        tileClassName="border-emerald-500/25 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12]"
      />
    </div>
  );
}
