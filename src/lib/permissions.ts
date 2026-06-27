import type { Place, User } from "@/lib/types";

export function canEditPlace(
  user: User | null | undefined,
  place: Pick<Place, "createdBy">,
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.role === "GESTOR") return place.createdBy?.id === user.id;
  return false;
}

export function filterManageablePlaces(
  places: Place[],
  user: User | null | undefined,
): Place[] {
  if (!user) return [];
  if (user.role === "ADMIN") return places;
  if (user.role === "GESTOR") {
    return places.filter((p) => p.createdBy?.id === user.id);
  }
  return [];
}
