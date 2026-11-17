"use client";

import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle light/dark mode"
      className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
    >
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </button>
  );
}
