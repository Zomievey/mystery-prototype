"use client";

import { useEffect, useState } from "react";
import { msUntilLocalMidnight, hhmmss } from "@/lib/revealTimer";

export default function Countdown() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(hhmmss(msUntilLocalMidnight()));
    tick(); // set immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing on the server (prevents hydration mismatch)
  if (time === null) return <span aria-hidden="true">&nbsp;</span>;

  return <span className="text-5xl font-mono">{time}</span>;
}
