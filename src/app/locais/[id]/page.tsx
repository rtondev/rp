"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MapPin } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type { Place, PlaceSignal } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { PlaceQuickActions } from "@/components/places/PlaceQuickActions";
import { Spin } from "@/components/ui/Spin";
import { PlaceRating } from "@/components/ui/StarRating";
import { PlaceOpenStatus } from "@/components/places/PlaceOpenStatus";
import { PlaceImageSlot } from "@/components/places/PlaceImageSlot";
import { PlaceOpeningHoursPanel } from "@/components/places/PlaceOpeningHoursPanel";
import {
  PlaceSignalCard,
  RespondSignalModal,
} from "@/components/signals/RespondSignalModal";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";

export default function LocalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isTurista, canRespondSignals } = useAuth();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [respondingTo, setRespondingTo] = useState<PlaceSignal | null>(null);

  useEffect(() => {
    api.places.get(id).then(setPlace).catch(() => router.push("/locais"));
  }, [id, router]);

  useEffect(() => {
    if (!user || !isTurista) return;
    api.favorites.check(id).then((res) => setFavorited(res.favorited)).catch(() => {});
  }, [user, isTurista, id]);

  async function toggleFavorite() {
    if (!user) {
      router.push("/entrar");
      return;
    }
    setFavoriteLoading(true);
    try {
      if (favorited) {
        await api.favorites.remove(id);
        setFavorited(false);
      } else {
        await api.favorites.add(id);
        setFavorited(true);
      }
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao atualizar favorito"));
    } finally {
      setFavoriteLoading(false);
    }
  }

  function updateSignal(updated: PlaceSignal) {
    setPlace((prev) =>
      prev
        ? {
            ...prev,
            signals: prev.signals?.map((s) =>
              s.id === updated.id ? updated : s,
            ),
          }
        : prev,
    );
  }

  async function handleRespond(response: string) {
    if (!respondingTo) return;
    try {
      const updated = await api.places.respondSignal(
        id,
        respondingTo.id,
        response,
      );
      updateSignal(updated);
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao responder"));
      throw err;
    }
  }

  if (!place) return <Spin size="sm" loop={false} />;

  const links = (place.links as { label: string; url: string }[]) ?? [];

  return (
    <div>
      <PageHeader title={place.title} backHref="/locais" />

      <PlaceImageSlot
        imageUrl={place.imageUrl}
        title={place.title}
        categoryIcon={place.category?.icon}
        size="lg"
      />

      <div className="mb-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {place.category && <Badge variant="accent">{place.category.name}</Badge>}
          <Badge variant={place.available ? "success" : "warning"}>
            {place.available ? "Disponível" : "Indisponível"}
          </Badge>
        </div>
        <PlaceRating
          averageRating={place.averageRating}
          ratingCount={place.ratingCount}
          size={18}
          showEmpty
          className="mb-2"
        />
        <PlaceOpenStatus openingHours={place.openingHours} className="mb-3" />
        <p className="text-sm leading-relaxed text-muted">{place.description}</p>
        {place.address && (
          <p className="mt-3 flex items-start gap-1.5 text-sm text-accent-dark">
            <MapPin size={16} weight="fill" className="mt-0.5 shrink-0 text-accent" />
            {place.address}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <PlaceOpeningHoursPanel openingHours={place.openingHours} className="mb-4" />

      <PlaceQuickActions
        placeId={id}
        isLoggedIn={Boolean(user)}
        showFavorite={!user || isTurista}
        favorited={favorited}
        favoriteLoading={favoriteLoading}
        onToggleFavorite={user && isTurista ? toggleFavorite : undefined}
        className="mb-4"
      />

      {place.signals && place.signals.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 font-medium text-accent-dark">
            💬 Feedback da comunidade
          </h3>
          <div className="flex flex-col gap-2">
            {place.signals.map((s) => (
              <PlaceSignalCard
                key={s.id}
                signal={s}
                canRespond={canRespondSignals}
                onRespond={() => setRespondingTo(s)}
              />
            ))}
          </div>
        </div>
      )}

      <RespondSignalModal
        signal={respondingTo}
        open={respondingTo != null}
        onClose={() => setRespondingTo(null)}
        onSubmit={handleRespond}
      />
    </div>
  );
}
