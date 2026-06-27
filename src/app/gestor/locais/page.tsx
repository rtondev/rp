"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilSimple, Plus, QrCode } from "@phosphor-icons/react";
import { PlaceImageSlot } from "@/components/places/PlaceImageSlot";
import { SignalAccessPanel } from "@/components/signals/SignalAccessPanel";
import { SideModal } from "@/components/ui/SideModal";
import { api } from "@/lib/api";
import type { Place } from "@/lib/types";
import { filterManageablePlaces } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlaceRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spin } from "@/components/ui/Spin";

export default function GestorLocaisPage() {
  const { user, canManagePlaces, isAdmin } = useAuth();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrPlace, setQrPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!canManagePlaces) {
      router.replace("/");
      return;
    }
    api.places
      .list()
      .then(setPlaces)
      .finally(() => setLoading(false));
  }, [canManagePlaces, router]);

  const manageable = useMemo(
    () => filterManageablePlaces(places, user),
    [places, user],
  );

  const pendingSignals = manageable.reduce(
    (acc, place) => acc + (place._count?.signals ?? 0),
    0,
  );

  if (!canManagePlaces) return null;

  return (
    <div>
      <PageHeader
        title={isAdmin ? "Painel de locais" : "Meus locais"}
        subtitle={
          isAdmin
            ? "Gerencie todos os locais cadastrados"
            : "Gerencie os locais que você cadastrou"
        }
        backHref="/perfil"
        action={
          <Link href="/locais/novo">
            <Button>
              <Plus size={16} weight="bold" className="mr-1" />
              Novo
            </Button>
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl">📍</p>
          <p className="mt-2 text-2xl font-semibold text-accent-dark">
            {manageable.length}
          </p>
          <p className="text-xs text-muted">
            {isAdmin ? "Locais no sistema" : "Seus locais"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl">🔔</p>
          <p className="mt-2 text-2xl font-semibold text-accent-dark">
            {pendingSignals}
          </p>
          <p className="text-xs text-muted">Sinalizações totais</p>
        </div>
      </div>

      {loading ? (
        <Spin size="sm" loop={false} />
      ) : manageable.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title={isAdmin ? "Nenhum local cadastrado" : "Você ainda não cadastrou locais"}
          description={
            isAdmin
              ? "Cadastre o primeiro ponto turístico ou estabelecimento."
              : "Comece adicionando um local para aparecer aqui."
          }
          action={
            <Link href="/locais/novo">
              <Button>Cadastrar local</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {manageable.map((place) => (
            <article
              key={place.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
            >
              <PlaceImageSlot
                imageUrl={place.imageUrl}
                title={place.title}
                categoryIcon={place.category?.icon}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/locais/${place.id}`}
                  className="block truncate font-semibold text-accent-dark hover:underline"
                >
                  {place.title}
                </Link>
                <PlaceRating
                  averageRating={place.averageRating}
                  ratingCount={place.ratingCount}
                  className="mt-1"
                />
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {place.category && (
                    <Badge variant="accent">{place.category.name}</Badge>
                  )}
                  <Badge variant={place.available ? "success" : "warning"}>
                    {place.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>
                {isAdmin && place.createdBy && (
                  <p className="mt-1 truncate text-xs text-muted">
                    Gestor: {place.createdBy.name}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 gap-1.5 px-3 text-xs"
                  onClick={() => setQrPlace(place)}
                >
                  <QrCode size={16} weight="bold" />
                  QR
                </Button>
                <Link href={`/locais/${place.id}/editar`}>
                  <Button
                    variant="secondary"
                    className="h-10 shrink-0 gap-1.5 px-4 text-xs"
                  >
                    <PencilSimple size={16} weight="bold" />
                    Editar
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <SideModal
        open={qrPlace !== null}
        onClose={() => setQrPlace(null)}
        title="QR e código do local"
        subtitle={qrPlace?.title}
      >
        {qrPlace && (
          <SignalAccessPanel placeId={qrPlace.id} />
        )}
      </SideModal>
    </div>
  );
}
