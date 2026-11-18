import { createAuthClient } from "better-auth/react";

const isProd = process.env.NODE_ENV === "production";

export const authClient = createAuthClient({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (isProd
      ? undefined
      : "http://localhost:3000"),
});

export const { signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;