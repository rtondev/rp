"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./LogoAnimada.module.css";

const LOOP_MS = 2600;
const RESET_MS = 60;

interface LogoAnimadaProps {
  className?: string;
  replayKey?: number;
  loop?: boolean;
}

function prepareSvg(svg: SVGSVGElement) {
  svg.querySelectorAll("path").forEach((path) => {
    if (!path.getAttribute("stroke-width")) {
      const className = path.getAttribute("class") ?? "";
      path.setAttribute("stroke-width", className.includes("svg-elem-5") ? "3" : "2");
    }

    path.setAttribute("fill", "transparent");
  });
}

function setupSvg(svg: SVGSVGElement) {
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Rota Potiguar");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.classList.add(styles.logo, "h-auto", "w-full");
  prepareSvg(svg);
}

export function LogoAnimada({
  className,
  replayKey = 0,
  loop = false,
}: LogoAnimadaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playTokenRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const play = useCallback(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return false;

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const token = ++playTokenRef.current;

    svg.classList.remove(styles.active);
    prepareSvg(svg);
    void svg.getBoundingClientRect();

    resetTimerRef.current = window.setTimeout(() => {
      resetTimerRef.current = null;
      if (playTokenRef.current !== token) return;
      if (!containerRef.current?.contains(svg)) return;

      svg.classList.add(styles.active);
    }, RESET_MS);

    return true;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | null = null;

    async function load(attempt = 0) {
      try {
        const response = await fetch("/logo-animada.svg");
        if (!response.ok) throw new Error("svg fetch failed");

        const markup = await response.text();
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = markup;

        const svg = containerRef.current.querySelector("svg");
        if (!svg) throw new Error("svg missing");

        setupSvg(svg);
        setLoadError(false);
        setReady(true);
      } catch {
        if (cancelled) return;

        if (attempt < 2) {
          retryTimer = window.setTimeout(() => {
            void load(attempt + 1);
          }, 250 * (attempt + 1));
          return;
        }

        setLoadError(true);
        setReady(false);
      }
    }

    setReady(false);
    setLoadError(false);
    void load();

    return () => {
      cancelled = true;
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      playTokenRef.current += 1;
      if (containerRef.current) containerRef.current.innerHTML = "";
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    play();
  }, [ready, replayKey, play]);

  useEffect(() => {
    if (!loop || !ready) return;

    const interval = window.setInterval(() => {
      play();
    }, LOOP_MS);

    return () => window.clearInterval(interval);
  }, [loop, ready, play]);

  return (
    <div className={cn("inline-flex w-full flex-col items-center justify-center", className)}>
      <div ref={containerRef} className="w-full" />
      {loadError ? (
        <p className="mt-2 text-center text-sm text-muted" role="status">
          Não foi possível carregar a animação.{" "}
          <button
            type="button"
            className="font-semibold text-accent underline-offset-2 hover:underline"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </p>
      ) : null}
    </div>
  );
}
