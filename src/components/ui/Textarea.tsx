"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { fieldClass, fieldLabelClass, textareaPlaceholder } from "@/lib/field";
import { FieldError } from "@/components/ui/FieldError";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  placeholder,
  required,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const resolvedPlaceholder =
    placeholder ?? (label ? textareaPlaceholder(label) : undefined);

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
      <textarea
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        placeholder={resolvedPlaceholder}
        className={cn(
          fieldClass(error),
          "min-h-[100px] px-4 py-3 placeholder:text-muted/70",
          className,
        )}
        {...props}
      />
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}
