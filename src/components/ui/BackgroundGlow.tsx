"use client";

import { m } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* big radial glow */}
      <m.div
        className="absolute left-1/2 top-[20%] h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary)/0.16), transparent 60%)",
        }}
        initial={{ opacity: 0.2, scale: 0.96 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      />
      {/* faint bottom vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.06))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.25))]" />
      {/* subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.8%22/></svg>')]" />
    </div>
  );
}
