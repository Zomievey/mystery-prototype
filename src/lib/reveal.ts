export function todayKey(d = new Date()) {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD-ish stable
}

export function isUnlocked(now = new Date()) {
  // unlocks at local midnight (00:00 of "today")
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  return now.getTime() >= startOfToday.getTime();
}
