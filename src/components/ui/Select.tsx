"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { fieldClass, fieldLabelClass } from "@/lib/field";
import { FieldError } from "@/components/ui/FieldError";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  hint,
  options,
  className,
  id,
  required,
  ...props
}: SelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className={fieldLabelClass()}>
          {label}
          {required && (
            <span className="ml-0.5 text-accent" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      <select
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(fieldClass(error), "h-11 px-4", className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}
