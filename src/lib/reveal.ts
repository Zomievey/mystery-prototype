// lib/reveal.ts
export function todayKey(): string {
    // UTC date string YYYY-MM-DD (stable across server/client)
    return new Date().toISOString().slice(0, 10);
}

export function isUnlocked(now: Date | string = new Date()) {
  const date = typeof now === "string" ? new Date(now) : now;
  const startOfToday = new Date(date);
  startOfToday.setHours(0, 0, 0, 0);
  return date.getTime() >= startOfToday.getTime();
}
