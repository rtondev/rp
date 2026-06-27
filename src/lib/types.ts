export type UserRole = "TURISTA" | "GESTOR" | "ADMIN";
export type SignalType = "SINALIZACAO" | "ELOGIO";

export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  icon?: string;
  _count?: { places: number };
}

export interface Link {
  label: string;
  url: string;
}

import type { OpeningHours } from "@/lib/opening-hours";
import type { SubmitContext } from "@/lib/device-context";

export type { OpeningHours };

export interface Place {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl?: string | null;
  available: boolean;
  links: Link[];
  openingHours?: OpeningHours | Record<string, unknown> | null;
  categoryId: string;
  category?: Category;
  createdBy?: { id: string; name: string; role: UserRole };
  averageRating?: number | null;
  ratingCount?: number;
  _count?: { signals: number };
  signals?: PlaceSignal[];
}

export interface PlaceSignal {
  id: string;
  placeId: string;
  type: SignalType;
  priority: number;
  rating?: number | null;
  message: string;
  response?: string | null;
  respondedAt?: string | null;
  createdAt: string;
  user?: { id: string; name: string };
  respondedBy?: { id: string; name: string };
  place?: { id: string; title: string };
}

export interface Favorite {
  id: string;
  placeId: string;
  createdAt: string;
  place: Place;
}

export interface CreatePlaceInput {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
  available?: boolean;
  links?: Link[];
  openingHours?: OpeningHours | Record<string, unknown>;
  categoryId: string;
}

export interface CreateSignalInput {
  type: SignalType;
  priority: number;
  rating?: number;
  message: string;
  submitContext: SubmitContext;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  TURISTA: "Turista",
  GESTOR: "Gestor",
  ADMIN: "Administrador",
};

export const REGISTER_ROLE_LABELS: Record<"TURISTA" | "GESTOR", string> = {
  TURISTA: "Turista",
  GESTOR: "Gestor",
};

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pendingTotal: number;
  answeredTotal: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export type SignalStatusFilter = "all" | "pending" | "answered";
export type SignalSortFilter = "newest" | "oldest";

export interface GestorSignalsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: SignalType;
  status?: SignalStatusFilter;
  sort?: SignalSortFilter;
}

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  SINALIZACAO: "Sinalização",
  ELOGIO: "Elogio",
};

export interface ResolvedSignalTarget {
  kind: "place";
  id: string;
  title: string;
  available: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SignalAccess {
  kind: "place";
  id: string;
  title: string;
  signalCode: string;
}
