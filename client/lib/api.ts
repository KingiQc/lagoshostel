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

export function getStoredSessionToken(): string | null {
  try {
    const session = JSON.parse(window.localStorage.getItem("arc.session") ?? "null") as { token?: string } | null;
    return session?.token ?? null;
  } catch {
    return null;
  }
}

export type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
};

export async function uploadImageToCloudinary(file: File, token: string): Promise<string> {
  const signatureResponse = await request<{ data: CloudinaryUploadSignature }>("/uploads/signature", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });
  const { data: signature } = signatureResponse;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = (await response.json()) as { secure_url?: string; error?: { message?: string } };
  if (!response.ok || !body.secure_url) throw new Error(body.error?.message ?? "The image could not be uploaded.");
  return body.secure_url;
}
