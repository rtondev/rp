export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function required(value: string, message: string) {
  return value.trim() ? undefined : message;
}

export function minLength(value: string, min: number, message: string) {
  return value.length >= min ? undefined : message;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
