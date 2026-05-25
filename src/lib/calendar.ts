import type { DayEntry } from "./types";

export type DayCell =
  | { kind: "padding" }
  | { kind: "untouched"; day: number; date: string; isToday: boolean }
  | { kind: "future"; day: number; date: string; isToday: boolean }
  | { kind: "rest"; day: number; date: string; isToday: boolean }
  | { kind: "trained"; day: number; date: string; count: number; isToday: boolean };

export interface MonthData {
  year: number;
  month: number;
  cells: DayCell[];
}

export interface MonthSummary {
  trained: number;
  rest: number;
  untouched: number;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

// Monday-start day-of-week index for the 1st of the month. 0 = Mon, 6 = Sun.
function leadingPaddingCount(year: number, month: number): number {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const sundayIndexed = firstOfMonth.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  return (sundayIndexed + 6) % 7; // Mon -> 0, Sun -> 6
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function buildMonthCells(
  year: number,
  month: number,
  entries: DayEntry[],
  today: string,
): DayCell[] {
  const cells: DayCell[] = [];
  const pad = leadingPaddingCount(year, month);
  for (let i = 0; i < pad; i++) {
    cells.push({ kind: "padding" });
  }

  const total = daysInMonth(year, month);
  const entryByDate = new Map<string, DayEntry>();
  for (const e of entries) entryByDate.set(e.date, e);

  for (let day = 1; day <= total; day++) {
    const date = dateKey(year, month, day);
    const isToday = date === today;
    const entry = entryByDate.get(date);

    if (date > today) {
      cells.push({ kind: "future", day, date, isToday });
    } else if (entry?.restDay) {
      cells.push({ kind: "rest", day, date, isToday });
    } else if (entry && !entry.restDay && entry.muscleGroups.length > 0) {
      cells.push({ kind: "trained", day, date, count: entry.muscleGroups.length, isToday });
    } else {
      cells.push({ kind: "untouched", day, date, isToday });
    }
  }

  return cells;
}

export function monthSummary(cells: DayCell[]): MonthSummary {
  let trained = 0;
  let rest = 0;
  let untouched = 0;
  for (const c of cells) {
    if (c.kind === "trained") trained++;
    else if (c.kind === "rest") rest++;
    else if (c.kind === "untouched") untouched++;
  }
  return { trained, rest, untouched };
}

export function firstDataMonth(entries: DayEntry[]): { year: number; month: number } | null {
  if (entries.length === 0) return null;
  let earliest = entries[0].date;
  for (const e of entries) {
    if (e.date < earliest) earliest = e.date;
  }
  const [y, m] = earliest.split("-");
  return { year: Number(y), month: Number(m) };
}

export function groupEntriesByMonth(entries: DayEntry[], today: string): MonthData[] {
  const [tyStr, tmStr] = today.split("-");
  const currentYear = Number(tyStr);
  const currentMonth = Number(tmStr);

  const first = firstDataMonth(entries) ?? { year: currentYear, month: currentMonth };

  const months: MonthData[] = [];
  let y = currentYear;
  let m = currentMonth;
  while (y > first.year || (y === first.year && m >= first.month)) {
    months.push({ year: y, month: m, cells: buildMonthCells(y, m, entries, today) });
    m--;
    if (m === 0) {
      m = 12;
      y--;
    }
  }
  return months;
}
