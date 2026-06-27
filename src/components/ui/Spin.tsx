"use client";

import { LogoAnimada } from "@/components/splash/LogoAnimada";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "max-w-[140px]",
  md: "max-w-[200px]",
  lg: "max-w-[260px]",
} as const;

interface SpinProps {
  fullScreen?: boolean;
  size?: keyof typeof sizes;
  loop?: boolean;
  label?: string;
  className?: string;
}

export function Spin({
  fullScreen = false,
  size = "md",
  loop = true,
  label,
  className,
}: SpinProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <LogoAnimada className={sizes[size]} loop={loop} />
      {label ? (
        <p className="text-sm text-muted">{label}</p>
      ) : (
        <span className="sr-only">Carregando</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6">
        {content}
      </div>
    );
  }

  return <div className="flex w-full justify-center py-10">{content}</div>;
}
