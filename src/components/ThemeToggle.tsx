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
  if (!mounted) return <div className="h-9 w-[110px]" aria-hidden="true" />;

  return (
    <LazyMotion features={loadFeatures}>
      <m.button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileTap={{ scale: prefersReduced ? 1 : 0.985 }}
        className={[
          "group relative inline-flex h-9 w-[110px] items-center rounded-full",
          "overflow-hidden", // ← keeps thumb inside
          "border border-black/10 dark:border-white/10",
          "bg-white/70 dark:bg-white/5 backdrop-blur",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-blue-500 focus-visible:ring-offset-[hsl(var(--bg))]",
        ].join(" ")}
      >
        {/* gradient accent sweep */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={false}
          animate={{
            background: isDark
              ? "linear-gradient(135deg, rgba(17,24,39,0.6), rgba(59,130,246,0.25))"
              : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(59,130,246,0.12))",
          }}
          transition={{ type: "tween", duration: 0.6 }} // ← match your 600ms theme fade
        />

        {/* labels */}
        <span className="z-10 flex w-full items-center justify-between px-3 text-xs font-medium">
          <m.span
            initial={false}
            animate={{ opacity: isDark ? 0.4 : 0.95, y: isDark ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="select-none text-[hsl(var(--fg))]"
          ></m.span>
          <m.span
            initial={false}
            animate={{ opacity: isDark ? 0.95 : 0.4, y: isDark ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="select-none text-[hsl(var(--fg))]"
          ></m.span>
        </span>

        {/* thumb */}
        <m.span
          aria-hidden
          layout
          className={[
            "absolute left-1 top-1 h-7 w-[52px] rounded-full transform-gpu", // ← GPU transform
            "bg-[hsl(var(--card))] shadow-[0_4px_14px_rgba(0,0,0,0.15)]",
            "border border-black/10 dark:border-white/10 cursor-pointer",
          ].join(" ")}
          animate={{ x: isDark ? 50 : 0 }} // ← correct travel
          transition={{ type: "spring", stiffness: 220, damping: 30 }} // ← slower, smoother
        >
          <div className="flex h-full w-full items-center justify-center">
            <m.div
              initial={false}
              animate={{
                rotate: isDark ? 0 : -90,
                opacity: isDark ? 0 : 1,
                scale: isDark ? 0.85 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }} // ← slightly slower
              className="absolute"
            >
              <Sun className="h-4 w-4 text-amber-500" />
            </m.div>
            <m.div
              initial={false}
              animate={{
                rotate: isDark ? 0 : 90,
                opacity: isDark ? 1 : 0,
                scale: isDark ? 1 : 0.85,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }} // ← slightly slower
              className="absolute"
            >
              <Moon className="h-4 w-4 text-blue-400" />
            </m.div>
          </div>
        </m.span>
      </m.button>
    </LazyMotion>
  );
}
