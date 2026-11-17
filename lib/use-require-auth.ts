"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useRequireAuth() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const authenticated = !!session?.user;

  useEffect(() => {
    if (!isPending && !authenticated) {
      router.replace("/login");
    }
  }, [isPending, authenticated, router]);

  return { session, isPending, authenticated };
}
