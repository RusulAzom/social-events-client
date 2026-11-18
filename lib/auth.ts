import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db("social-events");

const isProd = process.env.NODE_ENV === "production";

// Dynamically resolve the auth base URL. In production this must come from
// BETTER_AUTH_URL (set on Vercel/Render). In development we fall back to
// http://localhost:3000 so the dev server works without any env overrides.
const baseURL =
  process.env.BETTER_AUTH_URL ||
  (isProd
    ? {
        allowedHosts: [
          process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ""),
          process.env.VERCEL_URL,
        ].filter(Boolean) as string[],
        fallback: process.env.NEXT_PUBLIC_APP_URL,
        protocol: "auto" as const,
      }
    : {
        allowedHosts: ["localhost:3000"],
        fallback: "http://localhost:3000",
        protocol: "http" as const,
      });

// Origins that BetterAuth should trust for CSRF/origin checks and OAuth
// callbacks. Includes the client frontend URL, the app URL, any Vercel
// preview deployment, and localhost for local development.
const trustedOrigins = [
  process.env.CLIENT_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  isProd ? undefined : "http://localhost:3000",
].filter((o): o is string => o !== undefined && o !== null);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export type Session = typeof auth.$Infer.Session;