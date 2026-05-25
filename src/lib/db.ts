import { openDB, type DBSchema } from "idb";
import type { DayEntry, MuscleGroup } from "./types";

interface GymDB extends DBSchema {
  days: {
    key: string; // YYYY-MM-DD
    value: DayEntry;
  };
}

const DB_NAME = "gym-planner";
const DB_VERSION = 1;

function getDB() {
  return openDB<GymDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("days", { keyPath: "date" });
    },
  });
}

export async function getDayEntry(date: string) {
  const db = await getDB();
  return db.get("days", date);
}

export async function getRecentEntries(fromDate: string, days: number) {
  const db = await getDB();
  const all = await db.getAll("days");
  const from = new Date(fromDate + "T00:00:00");
  return all.filter((entry) => {
    const d = new Date(entry.date + "T00:00:00");
    const diff = Math.round((from.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= days;
  });
}

export async function getAllEntries(): Promise<DayEntry[]> {
  const db = await getDB();
  return db.getAll("days");
}

export async function toggleMuscleGroup(date: string, group: MuscleGroup) {
  const db = await getDB();
  const existing = await db.get("days", date);
  const groups = existing?.restDay ? [] : [...(existing?.muscleGroups ?? [])];
  const index = groups.indexOf(group);
  if (index >= 0) {
    groups.splice(index, 1);
  } else {
    groups.push(group);
  }
  if (groups.length === 0) {
    await db.delete("days", date);
  } else {
    await db.put("days", { date, muscleGroups: groups });
  }
  return groups;
}

export async function toggleRestDay(date: string) {
  const db = await getDB();
  const existing = await db.get("days", date);
  if (existing?.restDay) {
    await db.delete("days", date);
    return false;
  } else {
    await db.put("days", { date, restDay: true } as DayEntry);
    return true;
  }
}
