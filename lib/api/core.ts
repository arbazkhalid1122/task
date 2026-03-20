import { getApiBaseUrl } from "@/lib/env";
import { safeApiMessage } from "@/lib/apiErrors";

const API_BASE = getApiBaseUrl() ? `${getApiBaseUrl()}/api` : "/api";
const CSRF_COOKIE_CANDIDATES = [
  "__Host-next-auth.csrf-token",
  "next-auth.csrf-token",
  "__Host-authjs.csrf-token",
  "authjs.csrf-token",
  "XSRF-TOKEN",
  "csrfToken",
];

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedData<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
  items?: T[];
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getCsrfHeaderValue(): string | null {
  for (const name of CSRF_COOKIE_CANDIDATES) {
    const cookieValue = getCookieValue(name);
    if (!cookieValue) continue;

    const [token] = cookieValue.split("|");
    if (token?.trim()) {
      return token;
    }
  }

  return null;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const method = (options?.method ?? "GET").toUpperCase();
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);
    const headers = new Headers(options?.headers);
    if (options?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("X-Requested-With", "XMLHttpRequest");
    if (isMutation && !headers.has("X-CSRF-Token")) {
      const csrfToken = getCsrfHeaderValue();
      if (csrfToken) {
        headers.set("X-CSRF-Token", csrfToken);
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      cache: options?.cache ?? (isMutation ? "no-store" : undefined),
      credentials: "include",
      headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJsonResponse = contentType.includes("application/json");
    let data: unknown = null;

    if (response.status !== 204) {
      if (isJsonResponse) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      } else {
        const text = await response.text();
        data = text || null;
      }
    }

    if (!response.ok) {
      const fallback = "An error occurred";
      const dataRecord = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      const messageSource = dataRecord?.message;
      const message = Array.isArray(messageSource)
        ? messageSource.map((part) => String(part)).join(", ")
        : typeof messageSource === "string"
          ? messageSource
          : typeof data === "string" && data.trim()
            ? data.trim()
            : undefined;
      const errorLabel = typeof dataRecord?.error === "string" ? dataRecord.error.trim() : undefined;
      const genericLabels = new Set(["Error", "Bad Request", "Unauthorized", "Forbidden", "Conflict"]);
      const rawError =
        message ||
        (errorLabel && !genericLabels.has(errorLabel) ? errorLabel : undefined) ||
        (response.statusText ? `${response.status} ${response.statusText}` : undefined) ||
        fallback;
      return { error: safeApiMessage(rawError) };
    }

    return { data: data as T };
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Network error";
    return { error: safeApiMessage(raw) };
  }
}

/** Reserved for future token-based auth. Currently auth is cookie-based; this is a no-op. */
export function setApiAuthToken(token?: string): void {
  void token;
}
