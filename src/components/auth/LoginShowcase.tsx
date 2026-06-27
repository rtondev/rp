"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const SLIDES = [
  {
    phrase: "Turismo potiguar, do jeito que você merece.",
    color: "#e17b21",
  },
  {
    phrase: "Mar azul, areia quente, momento perfeito.",
    color: "#2d5f7a",
  },
  {
    phrase: "Trilhas, forró e histórias em cada esquina.",
    color: "#1b2d3a",
  },
  {
    phrase: "O sertão também encanta quem passa por aqui.",
    color: "#6b5340",
  },
  {
    phrase: "Monte sua rota e vá viver isso.",
    color: "#1a5c54",
  },
] as const;

const INTERVAL_MS = 3000;
const FADE_MS = 200;

export function LoginShowcase() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % SLIDES.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  function goTo(index: number) {
    if (index === active) return;
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, FADE_MS);
  }

  const slide = SLIDES[active];

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-10 py-16 transition-colors duration-500 ease-in-out lg:px-16"
      style={{ backgroundColor: slide.color }}
      aria-live="polite"
    >
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-10 text-center">
        <Image
          src="/logo.svg"
          alt="Rota Potiguar"
          width={240}
          height={52}
          priority
          className="h-auto w-full max-w-[240px] brightness-0 invert"
        />

        <div
          className={cn(
            "transition-all duration-200",
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <p className="max-w-sm text-lg leading-relaxed font-semibold tracking-tight text-white lg:text-2xl">
            {slide.phrase}
          </p>
        </div>

        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Frase ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 cursor-pointer rounded-full transition-all duration-300",
                i === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
