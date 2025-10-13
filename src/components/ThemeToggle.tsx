"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { LazyMotion, m, useReducedMotion } from "framer-motion";
const loadFeatures = () =>
  import("@/lib/framer-features").then((res) => res.default);

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-7 w-[72px]" aria-hidden="true" />;

  return (
    <LazyMotion features={loadFeatures}>
      <m.button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileTap={{ scale: prefersReduced ? 1 : 0.97 }}
        className={[
          "group relative inline-flex h-7 w-[72px] items-center rounded-full",
          "overflow-hidden border border-black/10 dark:border-white/10",
          "bg-white/70 dark:bg-white/5 backdrop-blur",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[hsl(var(--bg))]",
        ].join(" ")}
      >
        {/* gradient accent sweep */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={false}
          animate={{
            background: isDark
              ? "linear-gradient(135deg, rgba(17,24,39,0.7), rgba(59,130,246,0.3))"
              : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(59,130,246,0.12))",
          }}
          transition={{ type: "tween", duration: 0.5 }}
        />

        {/* thumb */}
        <m.span
          aria-hidden
          layout
          className={[
            "absolute left-[3px] top-[3px] h-[22px] w-[33px] rounded-full transform-gpu",
            "bg-[hsl(var(--card))] shadow-[0_3px_10px_rgba(0,0,0,0.12)]",
            "border border-black/10 dark:border-white/10 cursor-pointer",
          ].join(" ")}
          animate={{ x: isDark ? 34 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <m.div
              initial={false}
              animate={{
                rotate: isDark ? 0 : -90,
                opacity: isDark ? 0 : 1,
                scale: isDark ? 0.85 : 1,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute"
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            </m.div>
            <m.div
              initial={false}
              animate={{
                rotate: isDark ? 0 : 90,
                opacity: isDark ? 1 : 0,
                scale: isDark ? 1 : 0.85,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute"
            >
              <Moon className="h-3.5 w-3.5 text-blue-400" />
            </m.div>
          </div>
        </m.span>
      </m.button>
    </LazyMotion>
  );
}
