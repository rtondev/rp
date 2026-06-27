"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import type { Place } from "@/lib/types";
import { distanceKm } from "@/lib/geo";
import { getMapTileConfig, resolveMapTheme, type ResolvedMapTheme } from "@/lib/map-tiles";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";
import "leaflet/dist/leaflet.css";

type UserLocation = {
  latitude: number;
  longitude: number;
};

interface HomeNearbyMapProps {
  places: Place[];
  userLocation: UserLocation | null;
  areaLabel: string | null;
  className?: string;
}

import { createCategoryPlaceIcon } from "@/lib/map-place-icon";

type NearbyPlace = Place & { distanceKm: number };

function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid var(--surface);box-shadow:0 0 0 4px rgba(37,99,235,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function formatPlaceArea(place: Place): string {
  if (!place.address) return place.title;
  const parts = place.address.split(",").map((part) => part.trim());
  return parts.slice(0, 2).join(", ") || place.title;
}

export function HomeNearbyMap({
  places,
  userLocation,
  areaLabel,
  className,
}: HomeNearbyMapProps) {
  const { preference } = useTheme();
  const [mapTheme, setMapTheme] = useState<ResolvedMapTheme>(() =>
    resolveMapTheme(preference),
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const nearbyPlaces = useMemo<NearbyPlace[]>(() => {
    if (!userLocation) {
      return places.slice(0, 6).map((place) => ({ ...place, distanceKm: 0 }));
    }

    return places
      .map((place) => ({
        ...place,
        distanceKm: distanceKm(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude,
        ),
      }))
      .filter((place) => place.distanceKm <= 25)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 8);
  }, [places, userLocation]);

  const mapThemeResolved = mapTheme;

  useEffect(() => {
    setMapTheme(resolveMapTheme(preference));

    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setMapTheme(resolveMapTheme("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const fallbackCenter: L.LatLngExpression = [-5.7945, -35.211];

    const map = L.map(mapRef.current, {
      center: fallbackCenter,
      zoom: 13,
      minZoom: 11,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: true,
    });

    const tile = getMapTileConfig(mapTheme);
    const tileLayer = L.tileLayer(tile.url, {
      attribution: tile.attribution,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tileLayer = tileLayerRef.current;
    if (!tileLayer) return;

    const tile = getMapTileConfig(mapThemeResolved);
    tileLayer.setUrl(tile.url);
  }, [mapThemeResolved]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds([]);

    if (userLocation) {
      const userMarker = L.marker(
        [userLocation.latitude, userLocation.longitude],
        { icon: createUserIcon() },
      );
      userMarker.bindTooltip("Você está aqui", {
        direction: "top",
        offset: [0, -8],
      });
      markersLayer.addLayer(userMarker);
      bounds.extend([userLocation.latitude, userLocation.longitude]);
    }

    for (const place of nearbyPlaces) {
      const marker = L.marker([place.latitude, place.longitude], {
        icon: createCategoryPlaceIcon(place.category?.icon),
      });
      marker.bindPopup(
        `<strong>${place.title}</strong><br/>${formatPlaceArea(place)}`,
      );
      markersLayer.addLayer(marker);
      bounds.extend([place.latitude, place.longitude]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.22), { animate: false, maxZoom: 14 });
    } else if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 13);
    }
  }, [nearbyPlaces, userLocation]);

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-accent-dark">Perto de você</h2>
          <p className="mt-0.5 text-xs text-muted">
            {areaLabel ?? "Locais cadastrados na região"}
          </p>
        </div>
        <Link
          href="/locais"
          className="text-xs font-semibold text-accent hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div ref={mapRef} className="h-[260px] w-full [&_.leaflet-control-attribution]:text-[10px]" />
      </div>
    </section>
  );
}
