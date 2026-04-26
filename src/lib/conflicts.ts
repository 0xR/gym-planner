import type { MuscleGroup, DayEntry } from "./types";

// Strong conflicts: 2 day rest needed (same as training the same group)
// Weak conflicts: 1 day rest needed
type ConflictWeight = 1 | 2;

const CONFLICT_PAIRS: [MuscleGroup, MuscleGroup, ConflictWeight][] = [
  ["chest", "shoulders", 2],
  ["chest", "triceps", 1],
  ["back", "biceps", 1],
  ["shoulders", "triceps", 1],
  ["shoulders", "traps", 1],
];

interface ConflictInfo {
  source: MuscleGroup;
  daysAgo: number;
  restDays: number;
}

function getRestDays(a: MuscleGroup, b: MuscleGroup): number {
  if (a === b) return 2;
  for (const [m1, m2, weight] of CONFLICT_PAIRS) {
    if ((a === m1 && b === m2) || (a === m2 && b === m1)) {
      return weight;
    }
  }
  return 0;
}

export function getConflicts(
  muscleGroup: MuscleGroup,
  recentEntries: DayEntry[],
  currentDate: string,
): ConflictInfo | null {
  const today = new Date(currentDate + "T00:00:00");
  let worstConflict: ConflictInfo | null = null;

  for (const entry of recentEntries) {
    if (entry.date === currentDate) continue;
    if (entry.restDay) continue;
    const entryDate = new Date(entry.date + "T00:00:00");
    const daysAgo = Math.round((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 0 || daysAgo > 2) continue;

    for (const trained of entry.muscleGroups) {
      const restNeeded = getRestDays(muscleGroup, trained);
      if (restNeeded > 0 && daysAgo <= restNeeded) {
        if (
          !worstConflict ||
          restNeeded - daysAgo > worstConflict.restDays - worstConflict.daysAgo
        ) {
          worstConflict = { source: trained, daysAgo, restDays: restNeeded };
        }
      }
    }
  }

  return worstConflict;
}
