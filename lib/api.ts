const API_URL = process.env.NEXT_PUBLIC_API_URL;

let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

/**
 * Fetches a backend JWT from ${NEXT_PUBLIC_API_URL}/api/jwt
 * using the current BetterAuth session cookies.
 */
async function fetchBackendToken(): Promise<string | null> {
  if (tokenPromise) return tokenPromise;
  if (cachedToken) return cachedToken;

  tokenPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "GET",
        credentials: "include", // send BetterAuth cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        cachedToken = null;
        return null;
      }
      const data = await res.json();
      cachedToken = data.token || null;
      return cachedToken;
    } catch {
      cachedToken = null;
      return null;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

/**
 * Clear cached token (e.g. on logout)
 */
export function clearCachedToken(): void {
  cachedToken = null;
  tokenPromise = null;
}

/**
 * Wrapper around fetch that attaches a Bearer token when a BetterAuth session
 * is active. Use this for all protected API calls to the backend.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = await fetchBackendToken();

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

/**
 * Convenience helpers
 */
export const api = {
  get: (url: string, init?: RequestInit) =>
    fetchWithAuth(url, { ...init, method: "GET" }),
  post: (url: string, body?: unknown, init?: RequestInit) =>
    fetchWithAuth(url, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers as Record<string, string> || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (url: string, body?: unknown, init?: RequestInit) =>
    fetchWithAuth(url, {
      ...init,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers as Record<string, string> || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (url: string, init?: RequestInit) =>
    fetchWithAuth(url, { ...init, method: "DELETE" }),
};