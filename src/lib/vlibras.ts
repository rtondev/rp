export const VLIBRAS_STORAGE_KEY = "rp-vlibras-enabled";

export function getStoredVLibrasEnabled(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(VLIBRAS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setStoredVLibrasEnabled(enabled: boolean) {
  try {
    localStorage.setItem(VLIBRAS_STORAGE_KEY, String(enabled));
  } catch {
    /* quota / private mode */
  }
}
