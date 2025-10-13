"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class" // toggles 'dark' on <html>
      defaultTheme="system" // follow OS until user picks
      enableSystem
      storageKey="mm-theme" // custom localStorage key
      enableColorScheme={false} // we set color-scheme in CSS
      // DO NOT set disableTransitionOnChange (we want smooth fades)
    >
      {children}
    </NextThemes>
  );
}
