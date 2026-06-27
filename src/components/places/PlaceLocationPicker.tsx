"use client";

import { useEffect, useState } from "react";
import { MapPin, Crosshair } from "@phosphor-icons/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  formatCoordinates,
  reverseGeocode,
  searchAddressPlaces,
  type GeocodingResult,
} from "@/lib/geocoding";
import {
  getCurrentPosition,
  getGeoErrorMessage,
} from "@/lib/device-context";
import { toastError } from "@/lib/toast";
import { getErrorMessage } from "@/lib/validate";

export interface PlaceLocationValue {
  latitude: string;
  longitude: string;
  address: string;
}

interface PlaceLocationPickerProps {
  value: PlaceLocationValue;
  onChange: (value: PlaceLocationValue) => void;
  error?: string;
}

export function PlaceLocationPicker({
  value,
  onChange,
  error,
}: PlaceLocationPickerProps) {
  const [query, setQuery] = useState(value.address);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (value.address) setQuery(value.address);
  }, [value.address]);

  const hasCoordinates = Boolean(value.latitude && value.longitude);

  async function handleSearch() {
    const term = query.trim();
    if (term.length < 3) {
      toastError("Digite pelo menos 3 caracteres para buscar");
      return;
    }

    setSearching(true);
    try {
      const found = await searchAddressPlaces(term);
      setResults(found);
      if (found.length === 0) {
        toastError("Nenhum endereço encontrado");
      }
    } catch (err) {
      toastError(getErrorMessage(err, "Erro ao buscar endereço"));
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectResult(result: GeocodingResult) {
    onChange({
      latitude: String(result.latitude),
      longitude: String(result.longitude),
      address: result.address,
    });
    setQuery(result.address);
    setResults([]);
  }

  async function handleUseCurrentLocation() {
    setLocating(true);
    try {
      const position = await getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let address = "";

      try {
        address = await reverseGeocode(latitude, longitude);
      } catch {
        address = formatCoordinates(latitude, longitude);
      }

      onChange({
        latitude: String(latitude),
        longitude: String(longitude),
        address,
      });
      setQuery(address);
      setResults([]);
    } catch (err) {
      toastError(getGeoErrorMessage(err));
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input
          label="Localização"
          value={query}
          error={error}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleSearch();
            }
          }}
          placeholder="Ex.: Praia de Ponta Negra, Natal RN"
          required
        />
        <p className="text-xs text-muted">
          Busque o endereço ou use sua localização atual
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          onClick={() => void handleSearch()}
          disabled={searching}
        >
          <MapPin className="size-4" aria-hidden />
          {searching ? "Buscando..." : "Buscar endereço"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          onClick={() => void handleUseCurrentLocation()}
          disabled={locating}
        >
          <Crosshair className="size-4" aria-hidden />
          {locating ? "Obtendo..." : "Usar minha localização"}
        </Button>
      </div>

      {results.length > 0 && (
        <ul className="overflow-hidden rounded-2xl border border-border bg-surface">
          {results.map((result) => (
            <li key={`${result.latitude}-${result.longitude}-${result.label}`}>
              <button
                type="button"
                onClick={() => selectResult(result)}
                className="w-full border-b border-border px-4 py-3 text-left text-sm text-accent-dark transition-colors last:border-b-0 hover:bg-surface-hover"
              >
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasCoordinates && (
        <p className="text-xs text-muted">
          Coordenadas:{" "}
          {formatCoordinates(Number(value.latitude), Number(value.longitude))}
        </p>
      )}
    </div>
  );
}
