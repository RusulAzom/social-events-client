"use strict";

import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { authClient } from "@/lib/auth-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}