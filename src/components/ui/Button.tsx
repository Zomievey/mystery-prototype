"use client";

import { forwardRef } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "outline";
} & HTMLMotionProps<"button">;

const variants = {
  primary:
    "btn-primary px-4 py-2 shadow-sm hover:brightness-105 active:brightness-95",
  outline:
    "btn-outline px-4 py-2 hover:bg-[hsl(var(--card))/0.5] active:bg-[hsl(var(--card))/0.8]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, children, ...props },
  ref,
) {
  return (
    <m.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
      className={cn(
        "rounded-[10px] border-border focus-visible:outline-none focus-visible:ring-2 ring-ring",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </m.button>
  );
});

export default Button;
