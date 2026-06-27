"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/cn";

function hasImageUrl(url?: string | null): boolean {
  return Boolean(url?.trim());
}

type PlaceImageSlotSize = "sm" | "md" | "lg";

const sizeClasses: Record<PlaceImageSlotSize, string> = {
  sm: "h-[4.25rem] w-[4.25rem] shrink-0 rounded-xl",
  md: "h-14 w-14 shrink-0 rounded-lg",
  lg: "mb-4 h-48 w-full rounded-3xl",
};

const iconSizes: Record<PlaceImageSlotSize, number> = {
  sm: 28,
  md: 24,
  lg: 48,
};

interface PlaceImageSlotProps {
  imageUrl?: string | null;
  title: string;
  categoryIcon?: string | null;
  size?: PlaceImageSlotSize;
  className?: string;
}

export function PlaceImageSlot({
  imageUrl,
  title,
  categoryIcon,
  size = "sm",
  className,
}: PlaceImageSlotProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = hasImageUrl(imageUrl) && !imageFailed;
  const iconSize = iconSizes[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden media-placeholder",
        sizeClasses[size],
        className,
      )}
    >
      {showImage ? (
        <Image
          src={imageUrl!.trim()}
          alt={title}
          fill
          className="object-cover"
          sizes={size === "lg" ? "100vw" : size === "md" ? "56px" : "68px"}
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5">
          <CategoryIcon
            name={categoryIcon ?? "MapPin"}
            size={iconSize}
            weight="duotone"
            className="text-accent"
          />
        </div>
      )}
    </div>
  );
}
