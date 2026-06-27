"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  backHref,
  backLabel = "Voltar",
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-0.5 text-sm font-medium text-muted transition-colors hover:text-accent-dark"
        >
          <CaretLeft size={18} weight="bold" aria-hidden />
          {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-accent-dark">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
