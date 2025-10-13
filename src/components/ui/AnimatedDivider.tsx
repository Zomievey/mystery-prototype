"use client";

import { motion, useTransform } from "framer-motion";

interface AnimatedDividerProps {
  remainingMs?: number;
}

export default function AnimatedDivider({ remainingMs }: AnimatedDividerProps) {
  // Calculate scale based on remaining time (24 hours in ms = 86400000)
  const scaleX = useTransform(() => {
    if (remainingMs === undefined) return 1;
    // Start at 1 (100% width) and decrease to 0 (0% width)
    return Math.max(0, Math.min(1, remainingMs / 86400000));
  });

  return (
    <div className="w-full flex justify-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: 1,
          scaleX: 1,
        }}
        style={{
          scaleX,
          transformOrigin: "center",
          width: "100%",
        }}
        transition={{
          duration: 0.8,
          ease: [0.2, 0.8, 0.2, 1],
          scaleX: { duration: 0.5, ease: "linear" },
        }}
        className="h-1.5 rounded-full bg-[hsl(var(--primary))]"
      />
    </div>
  );
}
