import type { MuscleGroup, DayEntry } from "./types";

const BIG_MUSCLES = new Set<MuscleGroup>(["back", "chest", "shoulders", "legs"]);

// Pairs of muscles that conflict due to anatomical overlap (compound lifts hit secondaries).
// Same-group conflicts are handled separately.
const CONFLICT_PAIRS: [MuscleGroup, MuscleGroup][] = [
  ["chest", "shoulders"],
  ["chest", "triceps"],
  ["back", "biceps"],
  ["shoulders", "triceps"],
  ["shoulders", "traps"],
];

interface ConflictInfo {
  source: MuscleGroup;
  daysAgo: number;
  restDays: number;
}

function pairsConflict(a: MuscleGroup, b: MuscleGroup): boolean {
  if (a === b) return true;
  return CONFLICT_PAIRS.some(([m1, m2]) => (a === m1 && b === m2) || (a === m2 && b === m1));
}

function getRestDays(a: MuscleGroup, b: MuscleGroup): number {
  if (!pairsConflict(a, b)) return 0;
  return BIG_MUSCLES.has(a) && BIG_MUSCLES.has(b) ? 2 : 1;
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
