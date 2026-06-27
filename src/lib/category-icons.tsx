import type { IconProps } from "@phosphor-icons/react";
import {
  Armchair,
  Bed,
  Bicycle,
  Binoculars,
  Boat,
  Buildings,
  CalendarBlank,
  Camera,
  Car,
  Coffee,
  ForkKnife,
  GlobeHemisphereWest,
  Heart,
  MapPin,
  MaskHappy,
  Mountains,
  MusicNotes,
  Park,
  ShoppingBag,
  Star,
  Sun,
  Tag,
  Tent,
  Tree,
  Umbrella,
  Wine,
  type Icon,
} from "@phosphor-icons/react";

export const CATEGORY_ICON_MAP: Record<string, Icon> = {
  Tag,
  MapPin,
  ForkKnife,
  Bed,
  MaskHappy,
  Tree,
  Mountains,
  Sun,
  Umbrella,
  Boat,
  Bicycle,
  Camera,
  Coffee,
  Wine,
  Buildings,
  MusicNotes,
  ShoppingBag,
  Park,
  Tent,
  Star,
  Heart,
  GlobeHemisphereWest,
  Binoculars,
  Car,
  CalendarBlank,
  Armchair,
};

export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICON_MAP);

export type CategoryIconName = keyof typeof CATEGORY_ICON_MAP;

export function getCategoryIcon(name?: string | null): Icon {
  if (name && name in CATEGORY_ICON_MAP) {
    return CATEGORY_ICON_MAP[name];
  }
  return Tag;
}

interface CategoryIconProps extends Omit<IconProps, "name"> {
  name?: string | null;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const IconComponent = getCategoryIcon(name);
  return <IconComponent {...props} />;
}
