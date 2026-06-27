"use client";

import { useId, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { fieldClass, fieldLabelClass, inputPlaceholder } from "@/lib/field";
import { FieldError } from "@/components/ui/FieldError";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hideLabel?: boolean;
}

export function Input({
  label,
  error,
  hideLabel,
  className,
  id,
  placeholder,
  required,
  type,
  onChange,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const resolvedPlaceholder =
    placeholder ?? (label ? inputPlaceholder(label) : undefined);
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && !hideLabel && (
        <label htmlFor={inputId} className={fieldLabelClass()}>
          {label}
          {required && (
            <span className="ml-0.5 text-accent" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          placeholder={resolvedPlaceholder}
          className={cn(
            fieldClass(error),
            "h-11 w-full px-4 placeholder:text-muted/70",
            isPassword && "pr-11",
            className,
          )}
          onChange={onChange}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted transition hover:text-accent-dark"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeSlash size={18} weight="regular" />
            ) : (
              <Eye size={18} weight="regular" />
            )}
          </button>
        )}
      </div>
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}
