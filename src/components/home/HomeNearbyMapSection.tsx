"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Place } from "@/lib/types";
import { getCurrentPosition } from "@/lib/device-context";
import { resolveAreaLabel } from "@/lib/geocoding";

const HomeNearbyMap = dynamic(
  () =>
    import("@/components/home/HomeNearbyMap").then((mod) => mod.HomeNearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[332px] animate-pulse rounded-2xl border border-border bg-surface-subtle" />
    ),
  },
);

export function HomeNearbyMapSection() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [areaLabel, setAreaLabel] = useState<string | null>(null);

  useEffect(() => {
    api.places.list().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function locate() {
      try {
        const position = await getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (cancelled) return;

        setUserLocation({ latitude, longitude });

        try {
          const label = await resolveAreaLabel(latitude, longitude);
          if (!cancelled) setAreaLabel(label);
        } catch {
          if (!cancelled) setAreaLabel(null);
        }
      } catch {
        if (!cancelled) {
          setUserLocation(null);
          setAreaLabel("Rio Grande do Norte");
        }
      }
    }

    void locate();

    return () => {
      cancelled = true;
    };
  }, []);

  if (places.length === 0 && !userLocation) return null;

  return (
    <HomeNearbyMap
      places={places}
      userLocation={userLocation}
      areaLabel={areaLabel}
      className="mb-8"
    />
  );
}
