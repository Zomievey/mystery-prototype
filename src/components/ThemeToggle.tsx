"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-14" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full border border-border bg-background/80 transition-all hover:bg-background/60 focus:outline-none focus:ring-1 focus:ring-ring/50 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="flex h-full w-full items-center px-1">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-card transition-transform duration-200 ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-foreground/80" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-foreground/80" />
          )}
        </div>
      </div>
    </button>
  );
}
