"use client";

import { Input } from "@/components/ui/Input";
import { formatPhoneMask } from "@/lib/phone";

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneInput({
  label = "Celular",
  value,
  onChange,
  error,
  disabled,
  required,
}: PhoneInputProps) {
  return (
    <Input
      label={label}
      inputMode="tel"
      autoComplete="tel"
      placeholder="(00) 00000-0000"
      value={value}
      error={error}
      disabled={disabled}
      required={required}
      onChange={(e) => onChange(formatPhoneMask(e.target.value))}
    />
  );
}
