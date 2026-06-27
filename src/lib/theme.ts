export const THEME_STORAGE_KEY = "rp-theme-preference";

export type ThemePreference = "system" | "light" | "dark" | "high-contrast";

export const THEME_PREFERENCES: ThemePreference[] = [
  "system",
  "light",
  "dark",
  "high-contrast",
];

export function isThemePreference(value: string | null): value is ThemePreference {
  return (
    value === "system" ||
    value === "light" ||
    value === "dark" ||
    value === "high-contrast"
  );
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function applyThemePreference(preference: ThemePreference) {
  document.documentElement.setAttribute("data-theme-preference", preference);
}

export const themeLabels: Record<
  ThemePreference,
  { label: string; description: string }
> = {
  system: {
    label: "Sistema",
    description: "Segue claro, escuro ou contraste do dispositivo",
  },
  light: {
    label: "Claro",
    description: "Fundo claro em qualquer horário",
  },
  dark: {
    label: "Escuro",
    description: "Modo noturno confortável para os olhos",
  },
  "high-contrast": {
    label: "Alto contraste",
    description: "Texto e bordas reforçados para melhor leitura",
  },
};

/** Script inline mínimo — evita flash antes do React hidratar */
export const themeInitScript = `(function(){try{var k="rp-theme-preference";var v=localStorage.getItem(k);var ok=["system","light","dark","high-contrast"];if(!v||ok.indexOf(v)<0)v="system";document.documentElement.setAttribute("data-theme-preference",v);}catch(e){document.documentElement.setAttribute("data-theme-preference","system");}})();`;
