const API_BASE = "/api/v1";

export type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

export type BackendPropertyRoom = {
  name: string;
  beds: number;
  price: number;
};

export type BackendProperty = {
  id: string;
  name: string;
  description: string;
  city: string;
  area: string;
  university: string;
  distance: string;
  photos: string[];
  amenities: string[];
  rooms: BackendPropertyRoom[];
  status: "draft" | "under_review" | "verified" | "changes_requested";
  createdAt: string;
};

export type HostelSearchFilters = {
  university?: string;
  location?: string;
  room?: string;
  verified?: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as T & ApiError;
  if (!response.ok) {
    throw new Error(body.error?.message ?? "The request could not be completed.");
  }
  return body as T;
}

export async function searchHostels(filters: HostelSearchFilters): Promise<BackendProperty[]> {
  const query = new URLSearchParams();
  if (filters.university) query.set("university", filters.university);
  if (filters.location) query.set("location", filters.location);
  if (filters.room && filters.room !== "Any room type") query.set("room", filters.room);
  if (filters.verified !== undefined) query.set("verified", String(filters.verified));

  const response = await request<{ data: BackendProperty[] }>(`/hostels?${query.toString()}`);
  return response.data;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "owner" | "university" | "admin";
  createdAt: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
  expiresAt: number;
};

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signup(input: { name: string; email: string; password: string; role: "student" | "owner" }): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
