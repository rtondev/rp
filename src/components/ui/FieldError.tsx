import { WarningCircle } from "@phosphor-icons/react";

interface FieldErrorProps {
  id?: string;
  message: string;
}

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-xs leading-snug text-red-600">
      <WarningCircle size={14} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
