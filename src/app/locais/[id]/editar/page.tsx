"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category, Place } from "@/lib/types";
import { canEditPlace } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceForm, type PlaceFormData } from "@/components/forms/PlaceForm";
import { SignalAccessPanel } from "@/components/signals/SignalAccessPanel";
import { openingHoursFromUnknown } from "@/components/places/OpeningHoursEditor";
import { Spin } from "@/components/ui/Spin";

export default function EditarLocalPage() {
  const { id } = useParams<{ id: string }>();
  const { user, canManagePlaces } = useAuth();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!canManagePlaces) {
      router.replace(`/locais/${id}`);
      return;
    }
    Promise.all([api.places.get(id), api.categories.list()]).then(([p, c]) => {
      if (!canEditPlace(user, p)) {
        router.replace("/gestor/locais");
        return;
      }
      setPlace(p);
      setCategories(c);
    });
  }, [canManagePlaces, id, router, user]);

  async function handleSubmit(data: PlaceFormData) {
    await api.places.update(id, {
      title: data.title,
      description: data.description,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      address: data.address || undefined,
      imageUrl: data.imageUrl || undefined,
      available: data.available,
      categoryId: data.categoryId,
      links: data.links,
      openingHours: data.openingHours,
    });
    router.push("/gestor/locais");
  }

  if (!place) return <Spin size="sm" loop={false} />;

  return (
    <div>
      <PageHeader title="Editar local" backHref="/gestor/locais" />
      <PlaceForm
        categories={categories}
        initial={{
          title: place.title,
          description: place.description,
          latitude: String(place.latitude),
          longitude: String(place.longitude),
          address: place.address ?? "",
          imageUrl: place.imageUrl ?? "",
          available: place.available,
          categoryId: place.categoryId,
          links: (place.links as PlaceFormData["links"]) ?? [],
          openingHours: openingHoursFromUnknown(place.openingHours),
        }}
        onSubmit={handleSubmit}
      />
      <SignalAccessPanel placeId={id} className="mt-6" />
    </div>
  );
}
