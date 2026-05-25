import { expect, test, describe } from "vitest";
import type { DayEntry } from "./types";
import { buildMonthCells, groupEntriesByMonth, monthSummary, firstDataMonth } from "./calendar";

describe("buildMonthCells", () => {
  test("May 2026 starts on Friday — 4 padding cells, then day 1", () => {
    const cells = buildMonthCells(2026, 5, [], "2026-05-25");
    // May 1 2026 is a Friday. With Monday-start, padding is Mon, Tue, Wed, Thu = 4 cells.
    expect(cells.slice(0, 4).every((c) => c.kind === "padding")).toBe(true);
    expect(cells[4]).toMatchObject({ kind: "untouched", day: 1 });
  });

  test("includes all days of the month", () => {
    const cells = buildMonthCells(2026, 5, [], "2026-05-25");
    const dayCells = cells.filter((c) => c.kind !== "padding");
    expect(dayCells).toHaveLength(31);
    expect(dayCells[0]).toMatchObject({ day: 1 });
    expect(dayCells[30]).toMatchObject({ day: 31 });
  });

  test("trained day shows count", () => {
    const entries: DayEntry[] = [{ date: "2026-05-12", muscleGroups: ["chest", "triceps", "abs"] }];
    const cells = buildMonthCells(2026, 5, entries, "2026-05-25");
    const day12 = cells.find((c) => c.kind !== "padding" && c.day === 12);
    expect(day12).toMatchObject({ kind: "trained", day: 12, count: 3 });
  });

  test("rest day shows kind=rest", () => {
    const entries: DayEntry[] = [{ date: "2026-05-13", restDay: true }];
    const cells = buildMonthCells(2026, 5, entries, "2026-05-25");
    const day13 = cells.find((c) => c.kind !== "padding" && c.day === 13);
    expect(day13).toMatchObject({ kind: "rest", day: 13 });
  });

  test("future days of the current month are kind=future", () => {
    const cells = buildMonthCells(2026, 5, [], "2026-05-15");
    const day20 = cells.find((c) => c.kind !== "padding" && c.day === 20);
    expect(day20).toMatchObject({ kind: "future", day: 20 });
  });

  test("today's cell is marked isToday", () => {
    const cells = buildMonthCells(2026, 5, [], "2026-05-15");
    const today = cells.find((c) => c.kind !== "padding" && c.day === 15);
    expect(today).toMatchObject({ kind: "untouched", day: 15, isToday: true });
  });

  test("a past month has no future cells regardless of today", () => {
    const cells = buildMonthCells(2026, 4, [], "2026-05-15");
    const future = cells.find((c) => c.kind === "future");
    expect(future).toBeUndefined();
  });

  test("a fully future month is all-future", () => {
    const cells = buildMonthCells(2026, 6, [], "2026-05-15");
    const dayCells = cells.filter((c) => c.kind !== "padding");
    expect(dayCells.every((c) => c.kind === "future")).toBe(true);
  });

  test("today as the 1st of the month: only day 1 is non-future and untouched", () => {
    const cells = buildMonthCells(2026, 5, [], "2026-05-01");
    const day1 = cells.find((c) => c.kind !== "padding" && c.day === 1);
    const day2 = cells.find((c) => c.kind !== "padding" && c.day === 2);
    expect(day1).toMatchObject({ kind: "untouched", isToday: true });
    expect(day2).toMatchObject({ kind: "future" });
  });
});

describe("monthSummary", () => {
  test("counts trained, rest, and untouched; excludes future and padding", () => {
    const entries: DayEntry[] = [
      { date: "2026-05-04", muscleGroups: ["chest"] },
      { date: "2026-05-05", restDay: true },
      { date: "2026-05-06", muscleGroups: ["legs", "calves"] },
    ];
    const cells = buildMonthCells(2026, 5, entries, "2026-05-10");
    expect(monthSummary(cells)).toEqual({ trained: 2, rest: 1, untouched: 7 });
    // Days 1–10 (10 days), minus 2 trained, minus 1 rest = 7 untouched.
  });

  test("a fully future month has zero counts", () => {
    const cells = buildMonthCells(2026, 6, [], "2026-05-15");
    expect(monthSummary(cells)).toEqual({ trained: 0, rest: 0, untouched: 0 });
  });

  test("a fully elapsed past month counts every day", () => {
    const entries: DayEntry[] = [{ date: "2026-04-15", muscleGroups: ["back"] }];
    const cells = buildMonthCells(2026, 4, entries, "2026-05-15");
    expect(monthSummary(cells)).toEqual({ trained: 1, rest: 0, untouched: 29 });
  });
});

describe("groupEntriesByMonth", () => {
  test("returns months newest-first from today back to first data month", () => {
    const entries: DayEntry[] = [
      { date: "2026-03-10", muscleGroups: ["chest"] },
      { date: "2026-05-04", muscleGroups: ["back"] },
    ];
    const months = groupEntriesByMonth(entries, "2026-05-15");
    expect(months).toHaveLength(3);
    expect(months[0]).toMatchObject({ year: 2026, month: 5 });
    expect(months[1]).toMatchObject({ year: 2026, month: 4 });
    expect(months[2]).toMatchObject({ year: 2026, month: 3 });
  });

  test("crosses year boundary correctly", () => {
    const entries: DayEntry[] = [{ date: "2025-12-20", muscleGroups: ["chest"] }];
    const months = groupEntriesByMonth(entries, "2026-02-01");
    expect(months.map((m) => `${m.year}-${m.month}`)).toEqual(["2026-2", "2026-1", "2025-12"]);
  });

  test("with no entries, returns only the current month", () => {
    const months = groupEntriesByMonth([], "2026-05-15");
    expect(months).toHaveLength(1);
    expect(months[0]).toMatchObject({ year: 2026, month: 5 });
  });

  test("each month has its cells populated", () => {
    const entries: DayEntry[] = [{ date: "2026-04-15", muscleGroups: ["back"] }];
    const months = groupEntriesByMonth(entries, "2026-05-15");
    const aprilDay15 = months[1].cells.find((c) => c.kind !== "padding" && c.day === 15);
    expect(aprilDay15).toMatchObject({ kind: "trained", count: 1 });
  });
});

describe("firstDataMonth", () => {
  test("returns the month of the earliest entry", () => {
    const entries: DayEntry[] = [
      { date: "2026-05-04", muscleGroups: ["chest"] },
      { date: "2026-03-10", muscleGroups: ["back"] },
      { date: "2026-04-20", restDay: true },
    ];
    expect(firstDataMonth(entries)).toEqual({ year: 2026, month: 3 });
  });

  test("returns null for empty input", () => {
    expect(firstDataMonth([])).toBeNull();
  });

  test("rest-only entries count as data", () => {
    const entries: DayEntry[] = [{ date: "2026-02-15", restDay: true }];
    expect(firstDataMonth(entries)).toEqual({ year: 2026, month: 2 });
  });
});
