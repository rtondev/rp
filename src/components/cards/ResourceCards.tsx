"use client";

import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/lib/category-icons";
import { PlaceRating } from "@/components/ui/StarRating";
import { PlaceOpenStatus } from "@/components/places/PlaceOpenStatus";
import { PlaceImageSlot } from "@/components/places/PlaceImageSlot";
import { cn } from "@/lib/cn";
import type { Place } from "@/lib/types";

export function PlaceCard({ place }: { place: Place }) {
  const subtitle = place.address?.trim() || place.description?.trim();

  return (
    <Link href={`/locais/${place.id}`} className="block">
      <article
        className={cn(
          "flex gap-3 overflow-hidden rounded-2xl border border-border/70 bg-surface p-3 shadow-soft transition",
          "hover:border-border hover:bg-surface-hover active:scale-[0.995]",
          !place.available && "opacity-95",
        )}
      >
        <PlaceImageSlot
          imageUrl={place.imageUrl}
          title={place.title}
          categoryIcon={place.category?.icon}
          size="sm"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-accent-dark">
              {place.title}
            </h3>

            <div className="flex flex-wrap items-center gap-1.5">
              {place.category && (
                <Badge
                  variant="accent"
                  className="gap-1 py-0 text-[10px] font-medium"
                >
                  <CategoryIcon
                    name={place.category.icon}
                    size={11}
                    weight="fill"
                  />
                  {place.category.name}
                </Badge>
              )}
              {!place.available && (
                <Badge variant="warning" className="py-0 text-[10px]">
                  Indisponível
                </Badge>
              )}
            </div>
          </div>

          <PlaceRating
            averageRating={place.averageRating}
            ratingCount={place.ratingCount}
            showEmpty
            compact
          />

          <PlaceOpenStatus openingHours={place.openingHours} compact />

          {subtitle && (
            <p className="line-clamp-1 text-xs leading-relaxed text-muted">
              {place.address?.trim() ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin
                    size={12}
                    weight="fill"
                    className="shrink-0 text-accent/80"
                  />
                  {place.address}
                </span>
              ) : (
                subtitle
              )}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
