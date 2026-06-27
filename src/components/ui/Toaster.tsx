"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import type { ThemePreference } from "@/lib/theme";

function toSonnerTheme(
  preference: ThemePreference,
): "light" | "dark" | "system" {
  if (preference === "light") return "light";
  if (preference === "dark" || preference === "high-contrast") return "dark";
  return "system";
}

export function Toaster() {
  const { preference } = useTheme();

  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      theme={toSonnerTheme(preference)}
    />
  );
}
