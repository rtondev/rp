import type {
  AuthResponse,
  Category,
  CreatePlaceInput,
  CreateSignalInput,
  Favorite,
  Place,
  PlaceSignal,
  PaginatedResponse,
  GestorSignalsQuery,
  ResolvedSignalTarget,
  SignalAccess,
  User,
  UserRole,
} from "./types";
import type { RegistrationContext } from "@/lib/device-context";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = "Erro na requisição";
    try {
      const body = await res.json();
      message = body.message ?? (Array.isArray(body.message) ? body.message[0] : message);
    } catch {
      message = res.statusText;
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function uploadRequest(path: string, file: File): Promise<{ url: string; publicId: string }> {
  const token = getToken();
  const body = new FormData();
  body.append("file", file);

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    let message = "Erro ao enviar imagem";
    try {
      const data = await res.json();
      message = data.message ?? (Array.isArray(data.message) ? data.message[0] : message);
    } catch {
      message = res.statusText;
    }
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export const api = {
  health: () => request<{ status: string; name: string }>("/"),

  auth: {
    phoneCheck: (phone: string) =>
      request<{ exists: boolean; name?: string }>("/auth/phone/check", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
    phoneSession: (data: {
      phone: string;
      name?: string;
      registrationContext?: RegistrationContext;
      proximityTarget?: { placeId: string };
    }) =>
      request<AuthResponse & { isNew: boolean }>("/auth/phone/session", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (email: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    }) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<User>("/auth/me"),
  },

  users: {
    profile: () => request<User>("/users/profile"),
    list: () => request<User[]>("/users"),
    update: (id: string, data: { name?: string; role?: UserRole }) =>
      request<User>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    updateProfile: (data: {
      name?: string;
      password?: string;
      role?: UserRole;
    }) =>
      request<User>("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  categories: {
    list: () => request<Category[]>("/categories"),
    get: (id: string) => request<Category>(`/categories/${id}`),
    create: (data: { name: string; description?: string; icon?: string }) =>
      request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: { name?: string; description?: string; icon?: string },
    ) =>
      request<Category>(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<void>(`/categories/${id}`, { method: "DELETE" }),
  },

  places: {
    list: (categoryId?: string) =>
      request<Place[]>(
        categoryId ? `/places?categoryId=${categoryId}` : "/places",
      ),
    get: (id: string) => request<Place>(`/places/${id}`),
    create: (data: CreatePlaceInput) =>
      request<Place>("/places", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<CreatePlaceInput>) =>
      request<Place>(`/places/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<void>(`/places/${id}`, { method: "DELETE" }),
    signal: (id: string, data: CreateSignalInput) =>
      request(`/places/${id}/signals`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    signals: (id: string) => request<PlaceSignal[]>(`/places/${id}/signals`),
    respondSignal: (placeId: string, signalId: string, response: string) =>
      request<PlaceSignal>(`/places/${placeId}/signals/${signalId}`, {
        method: "PATCH",
        body: JSON.stringify({ response }),
      }),
    signalAccess: (id: string) =>
      request<SignalAccess>(`/places/${id}/signal-access`),
  },

  signals: {
    resolve: (code: string) =>
      request<ResolvedSignalTarget>(`/signals/resolve/${code}`),
  },

  gestor: {
    signals: (params: GestorSignalsQuery = {}) => {
      const qs = new URLSearchParams();
      if (params.page) qs.set("page", String(params.page));
      if (params.limit) qs.set("limit", String(params.limit));
      if (params.search?.trim()) qs.set("search", params.search.trim());
      if (params.type) qs.set("type", params.type);
      if (params.status) qs.set("status", params.status);
      if (params.sort) qs.set("sort", params.sort);
      const query = qs.toString();
      return request<PaginatedResponse<PlaceSignal>>(
        `/gestor/signals${query ? `?${query}` : ""}`,
      );
    },
  },

  me: {
    signals: (params: GestorSignalsQuery = {}) => {
      const qs = new URLSearchParams();
      if (params.page) qs.set("page", String(params.page));
      if (params.limit) qs.set("limit", String(params.limit));
      if (params.search?.trim()) qs.set("search", params.search.trim());
      if (params.type) qs.set("type", params.type);
      if (params.status) qs.set("status", params.status);
      if (params.sort) qs.set("sort", params.sort);
      const query = qs.toString();
      return request<PaginatedResponse<PlaceSignal>>(
        `/me/signals${query ? `?${query}` : ""}`,
      );
    },
  },

  favorites: {
    list: () => request<Favorite[]>("/favorites"),
    check: (placeId: string) =>
      request<{ favorited: boolean }>(`/favorites/${placeId}`),
    add: (placeId: string) =>
      request<Favorite>(`/favorites/${placeId}`, { method: "POST" }),
    remove: (placeId: string) =>
      request<void>(`/favorites/${placeId}`, { method: "DELETE" }),
  },

  uploads: {
    image: (file: File) => uploadRequest("/uploads/image", file),
  },
};
