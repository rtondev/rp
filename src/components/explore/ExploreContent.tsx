"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category, Place } from "@/lib/types";
import { categorySlug } from "@/lib/slug";
import { Tabs } from "@/components/ui/Tabs";
import { PlaceCard } from "@/components/cards/ResourceCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Spin } from "@/components/ui/Spin";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

interface ExploreContentProps {
  categorySlug?: string;
}

export function ExploreContent({ categorySlug: slug }: ExploreContentProps) {
  const { canManagePlaces } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, allPlaces] = await Promise.all([
          api.categories.list(),
          api.places.list(),
        ]);
        setCategories(cats);
        setPlaces(allPlaces);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeCategory = slug
    ? categories.find((c) => categorySlug(c.name) === slug)
    : null;

  const filtered = activeCategory
    ? places.filter((p) => p.categoryId === activeCategory.id)
    : places;

  const tabs = [
    { id: "all", label: "Todos", href: "/locais", icon: null },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      href: `/locais/categoria/${categorySlug(c.name)}`,
      icon: c.icon,
    })),
  ];

  return (
    <div>
      <PageHeader
        title={activeCategory ? activeCategory.name : "Locais"}
        subtitle={
          activeCategory?.description ??
          "Pontos turísticos e estabelecimentos"
        }
        backHref={slug ? "/locais" : undefined}
        action={
          canManagePlaces ? (
            <Link href="/locais/novo">
              <Button>+ Novo</Button>
            </Link>
          ) : undefined
        }
      />

      <Tabs tabs={tabs} />

      <div className="mt-5 flex flex-col gap-2.5">
        {loading ? (
          <Spin size="sm" loop />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="MapPin"
            title="Nenhum local encontrado"
            description="Ainda não há locais nesta categoria."
          />
        ) : (
          filtered.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        )}
      </div>
    </div>
  );
}
