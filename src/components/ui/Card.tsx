"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function Card({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <m.section
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={cn(
        "rounded-[14px] border border-border bg-card text-foreground",
        "shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        "backdrop-blur-sm p-5",
        className,
      )}
    >
      {children}
    </m.section>
  );
}
