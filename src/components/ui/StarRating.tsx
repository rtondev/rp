"use client";

import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
  label?: string;
}

export function StarRating({
  value,
  onChange,
  size = 28,
  readOnly = false,
  className,
  label,
}: StarRatingProps) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-sm font-medium text-accent-dark">{label}</p>
      )}
      <div
        className="flex items-center gap-1"
        role={readOnly ? "img" : "radiogroup"}
        aria-label={
          readOnly
            ? `${value} de 5 estrelas`
            : label ?? "Selecione de 1 a 5 estrelas"
        }
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
            aria-pressed={!readOnly && value === star}
            onClick={() => onChange?.(star)}
            className={cn(
              "rounded-full transition-transform",
              !readOnly &&
                "cursor-pointer hover:scale-110 active:scale-95",
              readOnly && "cursor-default",
            )}
          >
            <Star
              size={size}
              weight={star <= value ? "fill" : "regular"}
              className={cn(
                star <= value ? "text-amber-400" : "text-star-empty",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface PlaceRatingProps {
  averageRating?: number | null;
  ratingCount?: number;
  size?: number;
  className?: string;
  showEmpty?: boolean;
  compact?: boolean;
}

export function PlaceRating({
  averageRating,
  ratingCount = 0,
  size = 14,
  className,
  showEmpty = false,
  compact = false,
}: PlaceRatingProps) {
  const hasRating = averageRating != null && ratingCount > 0;

  if (!hasRating && !showEmpty) return null;

  if (!hasRating) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <StarRating value={0} readOnly size={compact ? 12 : size} />
        <span className="text-[11px] text-muted">Sem avaliações</span>
      </div>
    );
  }

  const display = Math.round(averageRating * 10) / 10;
  const stars = Math.round(averageRating);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <StarRating value={stars} readOnly size={compact ? 12 : size} />
      <span
        className={cn(
          "font-semibold text-accent-dark",
          compact ? "text-[11px]" : "text-xs",
        )}
      >
        {display.toFixed(1)}
      </span>
      <span className={cn("text-muted", compact ? "text-[11px]" : "text-xs")}>
        ({ratingCount})
      </span>
    </div>
  );
}
