"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceForm, type PlaceFormData } from "@/components/forms/PlaceForm";

export default function NovoLocalPage() {
  const { canManagePlaces } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!canManagePlaces) router.replace("/gestor/locais");
    api.categories.list().then(setCategories);
  }, [canManagePlaces, router]);

  async function handleSubmit(data: PlaceFormData) {
    await api.places.create({
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

  return (
    <div>
      <PageHeader
        title="Novo local"
        subtitle="Cadastre um novo ponto"
        backHref="/gestor/locais"
      />
      <PlaceForm categories={categories} onSubmit={handleSubmit} submitLabel="Criar local" />
    </div>
  );
}
