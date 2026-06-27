export function buildSignalPageUrl(signalCode: string): string {
  const path = `/sinalizar?code=${signalCode}`;
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export function parseSignalCodeFromScan(text: string): string | null {
  const trimmed = text.trim();
  if (/^\d{6}$/.test(trimmed)) return trimmed;

  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";
    const url = new URL(trimmed, base);
    const fromQuery = url.searchParams.get("code");
    if (fromQuery) {
      const digits = fromQuery.replace(/\D/g, "");
      if (digits.length === 6) return digits;
    }
  } catch {
    // texto livre ou código parcial
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 6) return digits.slice(-6);
  return null;
}

export function formatSignalCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}
