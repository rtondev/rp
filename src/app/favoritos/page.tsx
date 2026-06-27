"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Favorite } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceCard } from "@/components/cards/ResourceCards";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function FavoritosPage() {
  const { isTurista } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isTurista) {
      router.replace("/perfil");
      return;
    }
    api.favorites
      .list()
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, [isTurista, router]);

  async function handleRemove(placeId: string) {
    await api.favorites.remove(placeId);
    setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
  }

  return (
    <div>
      <PageHeader
        title="Favoritos"
        subtitle="Locais que você salvou para visitar"
        backHref="/perfil"
      />

      <div className="flex flex-col gap-2.5">
        {loading ? (
          <p className="text-center text-sm text-muted">Carregando...</p>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon="Heart"
            title="Nenhum favorito ainda"
            description="Favorite locais para encontrá-los aqui depois."
            action={
              <Link href="/locais">
                <Button>Explorar locais</Button>
              </Link>
            }
          />
        ) : (
          favorites.map((fav) => (
            <div key={fav.id} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <PlaceCard place={fav.place} />
              </div>
              <Button
                variant="ghost"
                className="shrink-0 px-2 text-xs"
                onClick={() => handleRemove(fav.placeId)}
              >
                Remover
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
