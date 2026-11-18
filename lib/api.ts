import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const cachedTokens = new Map<string, string>();
const tokenPromises = new Map<string, Promise<string>>();

/**
 * Fetches a backend JWT from ${NEXT_PUBLIC_API_URL}/api/jwt
 * for the current BetterAuth session.
 */
async function fetchBackendToken(): Promise<{ token: string; sessionToken: string }> {
  const { data: session, error } = await authClient.getSession();
  const sessionToken = session?.session?.token;

  if (error || !sessionToken) {
    throw new Error("A signed-in session is required for this request.");
  }
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const cachedToken = cachedTokens.get(sessionToken);
  if (cachedToken) return { token: cachedToken, sessionToken };

  const existingRequest = tokenPromises.get(sessionToken);
  if (existingRequest) return { token: await existingRequest, sessionToken };

  const tokenRequest = (async () => {
    const res = await fetch(`${API_URL}/api/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });

    if (!res.ok) {
      throw new Error(`Backend token request failed (${res.status}).`);
    }

    const data: { token?: string } = await res.json();
    if (!data.token) {
      throw new Error("Backend token response did not include a token.");
    }

    cachedTokens.set(sessionToken, data.token);
    return data.token;
  })();

  tokenPromises.set(sessionToken, tokenRequest);
  try {
    return { token: await tokenRequest, sessionToken };
  } finally {
    tokenPromises.delete(sessionToken);
  }
}

/**
 * Clear cached token (e.g. on logout)
 */
export function clearCachedToken(): void {
  cachedTokens.clear();
  tokenPromises.clear();
}

/**
 * Wrapper around fetch that attaches a Bearer token when a BetterAuth session
 * is active. Use this for all protected API calls to the backend.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const credentials = await fetchBackendToken();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${credentials.token}`);

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status !== 401) return response;

  cachedTokens.delete(credentials.sessionToken);
  const refreshedCredentials = await fetchBackendToken();
  headers.set("Authorization", `Bearer ${refreshedCredentials.token}`);
  return fetch(input, { ...init, headers });
}

/**
 * Convenience helpers
 */
export const api = {
  get: (url: string, init?: RequestInit) =>
    fetchWithAuth(url, { ...init, method: "GET" }),
  post: (url: string, body?: unknown, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetchWithAuth(url, {
      ...init,
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  put: (url: string, body?: unknown, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetchWithAuth(url, {
      ...init,
      method: "PUT",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete: (url: string, init?: RequestInit) =>
    fetchWithAuth(url, { ...init, method: "DELETE" }),
};