export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "calves",
  "abs",
  "traps",
  "forearms",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export type DayEntry =
  | { date: string; restDay: true }
  | { date: string; restDay?: false; muscleGroups: MuscleGroup[] };
