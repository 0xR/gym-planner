export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "calves",
  "abs",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface DayEntry {
  date: string; // YYYY-MM-DD
  muscleGroups: MuscleGroup[];
}
