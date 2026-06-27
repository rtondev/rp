export function formatRelativeDate(date: string | Date): string {
  const value = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - value.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `há ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `há ${weeks} sem`;
  }

  return value.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year:
      value.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatFullDate(date: string | Date): string {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationBetween(
  from: string | Date,
  to: string | Date,
): string {
  const diffMs = Math.max(0, new Date(to).getTime() - new Date(from).getTime());
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "menos de 1 min";
  if (diffMin < 60) return `${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return diffHours === 1 ? "1 h" : `${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return diffDays === 1 ? "1 dia" : `${diffDays} dias`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return diffWeeks === 1 ? "1 sem" : `${diffWeeks} sem`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return diffMonths === 1 ? "1 mês" : `${diffMonths} meses`;
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "1 ano" : `${diffYears} anos`;
}
