/** Default production API when `NEXT_PUBLIC_API_URL` was not set at build time. */
const DEFAULT_PRODUCTION_API = "https://littlechampjunior-backend.vercel.app";

const PRODUCTION_FRONTEND_HOSTS = new Set([
  "littlechampjunior.vercel.app",
  "littlechampjunior.com",
  "www.littlechampjunior.com",
]);

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (PRODUCTION_FRONTEND_HOSTS.has(host)) {
      return DEFAULT_PRODUCTION_API;
    }
  }

  return "http://localhost:4100";
}
