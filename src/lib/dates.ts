export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function today(): string {
  return formatDate(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function dayLabel(dateStr: string): string {
  const t = today();
  if (dateStr === t) return "Today";
  const diff = Math.round(
    (new Date(t + "T00:00:00").getTime() -
      new Date(dateStr + "T00:00:00").getTime()) /
      (1000 * 60 * 60 * 24),
  );
  if (diff === 1) return "Yesterday";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
