"use client";

import { useCallback, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
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
  return Array.from({ length: 10 }, (_, index) => ({
    id: Date.now() + index,
    x: (Math.random() - 0.5) * 140,
    y: -(Math.random() * 90 + 30),
    rotate: (Math.random() - 0.5) * 60,
    delay: Math.random() * 0.12,
    scale: 0.5 + Math.random() * 0.7,
  }));
}

interface FavoriteButtonProps {
  favorited: boolean;
  loading?: boolean;
  onToggle: () => Promise<void>;
  className?: string;
}

export function FavoriteButton({
  favorited,
  loading = false,
  onToggle,
  className,
}: FavoriteButtonProps) {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const [popping, setPopping] = useState(false);

  const burst = useCallback(() => {
    const next = createParticles();
    setParticles(next);
    setPopping(true);
    window.setTimeout(() => setParticles([]), 900);
    window.setTimeout(() => setPopping(false), 350);
  }, []);

  async function handleClick() {
    if (loading) return;

    const willFavorite = !favorited;
    if (willFavorite) {
      burst();
    }

    await onToggle();
  }

  return (
    <div className={cn("relative", className)}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="heart-fly pointer-events-none absolute top-1/2 left-1/2 z-10 text-accent"
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
          <Heart size={16} weight="fill" />
        </span>
      ))}

      <Button
        fullWidth
        variant={favorited ? "secondary" : "ghost"}
        onClick={handleClick}
        disabled={loading}
        className="relative gap-2 overflow-visible"
      >
        <Heart
          size={18}
          weight={favorited ? "fill" : "regular"}
          className={cn(
            "text-accent transition-transform duration-300",
            popping && "heart-pop",
            favorited && !popping && "scale-110",
          )}
        />
        {favorited ? "Remover dos favoritos" : "Favoritar local"}
      </Button>
    </div>
  );
}
