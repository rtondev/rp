export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return name;
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function formatHomeGreeting(name?: string | null): string {
  const greeting = getGreeting();
  if (!name) return `${greeting}!`;
  return `${greeting}, ${getFirstName(name)}`;
}
