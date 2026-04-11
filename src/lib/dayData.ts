import { getDayEntry, getRecentEntries } from "./db";
import { today } from "./dates";
import type { DayEntry, MuscleGroup } from "./types";

export interface DayData {
  selected: MuscleGroup[];
  recentEntries: DayEntry[];
}

type ReactThenable<T> = Promise<T> & { status?: string; value?: T };

/** Create a thenable that React's use() can unwrap synchronously. */
function resolvedThenable<T>(value: T): ReactThenable<T> {
  const promise = Promise.resolve(value) as ReactThenable<T>;
  promise.status = "fulfilled";
  promise.value = value;
  return promise;
}

const MAX_DAYS_BACK = 7;
const cache = new Map<string, ReactThenable<DayData>>();

async function loadDayData(date: string): Promise<DayData> {
  const [dayEntry, recentEntries] = await Promise.all([
    getDayEntry(date),
    getRecentEntries(today(), MAX_DAYS_BACK),
  ]);
  return {
    selected: dayEntry?.muscleGroups ?? [],
    recentEntries,
  };
}

export function fetchDayData(date: string): Promise<DayData> {
  let promise = cache.get(date);
  if (!promise) {
    promise = loadDayData(date);
    cache.set(date, promise);
  }
  return promise;
}

export function optimisticToggle(date: string, group: MuscleGroup): void {
  const current = cache.get(date);
  if (!current || current.status !== "fulfilled" || !current.value) return;

  const prev = current.value;
  const selected = prev.selected.includes(group)
    ? prev.selected.filter((g) => g !== group)
    : [...prev.selected, group];

  const recentEntries = prev.recentEntries.filter((e) => e.date !== date);
  if (selected.length > 0) {
    recentEntries.push({ date, muscleGroups: selected });
  }

  cache.set(date, resolvedThenable({ selected, recentEntries }));

  // Other dates' conflict data depends on recentEntries — invalidate them
  for (const key of cache.keys()) {
    if (key !== date) cache.delete(key);
  }
}

export function invalidateAll() {
  cache.clear();
}
