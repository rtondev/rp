"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./LogoAnimada.module.css";

const LOOP_MS = 2200;

interface LogoAnimadaProps {
  className?: string;
  replayKey?: number;
  loop?: boolean;
}

function prepareSvg(svg: SVGSVGElement) {
  svg.querySelectorAll("path").forEach((path) => {
    const fill = path.getAttribute("fill");
    const stroke = path.getAttribute("stroke");

    if (fill && fill !== "none" && fill !== "transparent") {
      path.setAttribute("stroke", fill);
      if (!path.getAttribute("stroke-width")) {
        path.setAttribute("stroke-width", "2");
      }
    } else if (stroke && stroke !== "none") {
      if (!path.getAttribute("stroke-width")) {
        path.setAttribute("stroke-width", "3");
      }
    }
  });
}

export function LogoAnimada({
  className,
  replayKey = 0,
  loop = false,
}: LogoAnimadaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);

  const play = useCallback(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    svg.classList.remove(styles.active);
    void svg.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        svg.classList.add(styles.active);
      });
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch("/logo-animada.svg");
      const markup = await response.text();
      if (cancelled || !containerRef.current) return;

      containerRef.current.innerHTML = markup;

      const svg = containerRef.current.querySelector("svg");
      if (!svg) return;

      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Rota Potiguar");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.classList.add(styles.logo, "h-auto", "w-full");

      prepareSvg(svg);
      readyRef.current = true;
      setReady(true);
      play();
    }

    void load();

    return () => {
      cancelled = true;
      readyRef.current = false;
      setReady(false);
    };
  }, [play]);

  useEffect(() => {
    if (!readyRef.current || replayKey === 0) return;
    play();
  }, [replayKey, play]);

  useEffect(() => {
    if (!loop || !ready) return;

    const interval = setInterval(play, LOOP_MS);
    return () => clearInterval(interval);
  }, [loop, play, ready]);

  return (
    <div
      ref={containerRef}
      className={cn("inline-flex w-full justify-center", className)}
    />
  );
}
