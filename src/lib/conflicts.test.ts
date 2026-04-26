import { expect, test } from "vitest";
import { getConflicts } from "./conflicts";

test("flags chest as conflicting one day after shoulders", () => {
  const conflict = getConflicts(
    "chest",
    [{ date: "2026-04-25", muscleGroups: ["shoulders"] }],
    "2026-04-26",
  );
  expect(conflict).toEqual({ source: "shoulders", daysAgo: 1, restDays: 2 });
});

test("biceps self-conflict has 1-day rest (small muscle)", () => {
  const conflict = getConflicts(
    "biceps",
    [{ date: "2026-04-25", muscleGroups: ["biceps"] }],
    "2026-04-26",
  );
  expect(conflict).toEqual({ source: "biceps", daysAgo: 1, restDays: 1 });
});

test("biceps two days after biceps clears the rest period", () => {
  const conflict = getConflicts(
    "biceps",
    [{ date: "2026-04-24", muscleGroups: ["biceps"] }],
    "2026-04-26",
  );
  expect(conflict).toBeNull();
});

test("chest self-conflict keeps 2-day rest (big muscle)", () => {
  const conflict = getConflicts(
    "chest",
    [{ date: "2026-04-25", muscleGroups: ["chest"] }],
    "2026-04-26",
  );
  expect(conflict).toEqual({ source: "chest", daysAgo: 1, restDays: 2 });
});

test("legs trained yesterday does not conflict with chest today", () => {
  const conflict = getConflicts(
    "chest",
    [{ date: "2026-04-25", muscleGroups: ["legs"] }],
    "2026-04-26",
  );
  expect(conflict).toBeNull();
});
