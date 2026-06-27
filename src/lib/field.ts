import { cn } from "@/lib/cn";

export function inputPlaceholder(label: string) {
  const text = label.charAt(0).toLowerCase() + label.slice(1);
  return `Digite aqui ${text}`;
}

export function textareaPlaceholder(label: string) {
  const text = label.charAt(0).toLowerCase() + label.slice(1);
  return `Descreva aqui ${text}`;
}

export const fieldRadius = "rounded-[6px]";

export function fieldClass(error?: string, className?: string) {
  return cn(
    `${fieldRadius} border bg-surface text-sm text-accent-dark outline-none transition-all duration-200`,
    error
      ? "border-red-500 ring-2 ring-red-500/15 animate-field-shake focus:border-red-500 focus:ring-red-500/20"
      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/15",
    className,
  );
}

export function fieldLabelClass() {
  return "text-sm font-medium text-accent-dark";
}
