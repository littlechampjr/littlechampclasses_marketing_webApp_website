import { getApiBaseUrl } from "./config";
import { ApiError } from "./types";

type Json = Record<string, unknown>;

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as Json & { error?: unknown };

  if (!res.ok) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : res.status === 401
          ? "Please sign in again."
          : "Request failed";
    throw new ApiError(res.status, msg);
  }

  return data as T;
}
