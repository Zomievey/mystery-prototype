"use client";

import {
  ThemeProvider as NextThemes,
  useTheme as useNextTheme,
} from "next-themes";
import { useEffect } from "react";
import type { ReactNode } from "react";

// This component ensures the theme is applied before rendering children
function ThemeWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useNextTheme();

  useEffect(() => {
    // Add smooth transition for theme changes
    document.documentElement.style.transition =
      "background-color 200ms ease, color 200ms ease";

    // Cleanup function to remove the transition when component unmounts
    return () => {
      document.documentElement.style.transition = "";
    };
  }, []);

  // Prevent flash of unstyled content
  if (!resolvedTheme) {
    return null;
  }

  return <>{children}</>;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="mm-theme"
      enableColorScheme={false}
    >
      <ThemeWrapper>{children}</ThemeWrapper>
    </NextThemes>
  );
}
