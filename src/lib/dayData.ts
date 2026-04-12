import { getDayEntry, getRecentEntries } from "./db";
import type { DayEntry, MuscleGroup } from "./types";

export interface DayData {
  selected: MuscleGroup[];
  restDay: boolean;
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
    getRecentEntries(date, MAX_DAYS_BACK),
  ]);
  return {
    selected: dayEntry && !dayEntry.restDay ? dayEntry.muscleGroups : [],
    restDay: dayEntry?.restDay === true,
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
  const prevSelected = prev.restDay ? [] : prev.selected;
  const selected = prevSelected.includes(group)
    ? prevSelected.filter((g) => g !== group)
    : [...prevSelected, group];

  const recentEntries = prev.recentEntries.filter((e) => e.date !== date);
  if (selected.length > 0) {
    recentEntries.push({ date, muscleGroups: selected });
  }

  cache.set(date, resolvedThenable({ selected, restDay: false, recentEntries }));

  // Other dates' conflict data depends on recentEntries — invalidate them
  for (const key of cache.keys()) {
    if (key !== date) cache.delete(key);
  }
}

export function optimisticToggleRestDay(date: string): void {
  const current = cache.get(date);
  if (!current || current.status !== "fulfilled" || !current.value) return;

  const prev = current.value;
  const restDay = !prev.restDay;

  const recentEntries = prev.recentEntries.filter((e) => e.date !== date);
  if (restDay) {
    recentEntries.push({ date, restDay: true } as DayEntry);
  }

  cache.set(
    date,
    resolvedThenable({ selected: [], restDay, recentEntries }),
  );

  for (const key of cache.keys()) {
    if (key !== date) cache.delete(key);
  }
}

export function invalidateAll() {
  cache.clear();
}
