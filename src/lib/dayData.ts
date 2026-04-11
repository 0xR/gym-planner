import { getDayEntry, getRecentEntries } from "./db";
import { today } from "./dates";
import type { DayEntry, MuscleGroup } from "./types";

export interface DayData {
  selected: MuscleGroup[];
  recentEntries: DayEntry[];
}

const MAX_DAYS_BACK = 7;
const cache = new Map<string, Promise<DayData>>();

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

export function invalidateAll() {
  cache.clear();
}
