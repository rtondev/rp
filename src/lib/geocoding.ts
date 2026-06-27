export interface GeocodingResult {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

type NominatimSearchItem = {
  display_name: string;
  lat: string;
  lon: string;
};

type NominatimReverseResult = {
  display_name: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    state?: string;
  };
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "RotaPotiguar/1.0 (contato@rotapotiguar.com)";

async function nominatimFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "pt-BR",
      "User-Agent": USER_AGENT,
    },
  });

  if (!res.ok) {
    throw new Error("Não foi possível buscar o endereço agora");
  }

  return res.json() as Promise<T>;
}

function simplifyDisplayName(displayName: string): string {
  const parts = displayName.split(",").map((part) => part.trim());
  return parts.slice(0, 2).join(", ") || displayName;
}

export function formatAreaLabel(data: NominatimReverseResult): string {
  const address = data.address;
  if (!address) return simplifyDisplayName(data.display_name);

  const bairro =
    address.suburb || address.neighbourhood || address.quarter || undefined;
  const cidade =
    address.city ||
    address.town ||
    address.municipality ||
    address.village ||
    undefined;

  if (bairro && cidade) return `${bairro}, ${cidade}`;
  if (cidade && address.state) return `${cidade}, ${address.state}`;
  if (cidade) return cidade;

  return simplifyDisplayName(data.display_name);
}

async function reverseLookup(
  latitude: number,
  longitude: number,
  zoom?: string,
): Promise<NominatimReverseResult> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    addressdetails: "1",
  });

  if (zoom) params.set("zoom", zoom);

  return nominatimFetch<NominatimReverseResult>(
    `${NOMINATIM_BASE}/reverse?${params}`,
  );
}

export async function resolveAreaLabel(
  latitude: number,
  longitude: number,
): Promise<string> {
  const data = await reverseLookup(latitude, longitude, "14");
  return formatAreaLabel(data);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  const data = await reverseLookup(latitude, longitude);
  return data.display_name;
}

export async function searchAddressPlaces(
  query: string,
): Promise<GeocodingResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    q,
    format: "json",
    limit: "5",
    countrycodes: "br",
    addressdetails: "1",
  });

  const data = await nominatimFetch<NominatimSearchItem[]>(
    `${NOMINATIM_BASE}/search?${params}`,
  );

  return data.map((item) => ({
    label: item.display_name,
    address: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
  }));
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
