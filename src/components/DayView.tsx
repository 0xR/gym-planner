import { useCallback, useEffect, useRef, useState } from "react";
import { MUSCLE_GROUPS, type MuscleGroup, type DayEntry } from "../lib/types";
import { getConflicts } from "../lib/conflicts";
import { getDayEntry, getRecentEntries, toggleMuscleGroup } from "../lib/db";
import { today, addDays, dayLabel } from "../lib/dates";
import "./DayView.css";

const DISPLAY_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  legs: "Legs",
  calves: "Calves",
  abs: "Abs",
};

const MAX_DAYS_BACK = 7;

export function DayView() {
  const [offset, setOffset] = useState(0); // 0 = today, 1 = yesterday, etc.
  const [selected, setSelected] = useState<MuscleGroup[]>([]);
  const [recentEntries, setRecentEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDate = addDays(today(), -offset);

  const loadData = useCallback(async () => {
    const [dayData, recent] = await Promise.all([
      getDayEntry(currentDate),
      getRecentEntries(today(), MAX_DAYS_BACK),
    ]);
    setSelected(dayData?.muscleGroups ?? []);
    setRecentEntries(recent);
    setLoading(false);
  }, [currentDate]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleToggle = async (group: MuscleGroup) => {
    const newGroups = await toggleMuscleGroup(currentDate, group);
    setSelected([...newGroups]);
    const recent = await getRecentEntries(today(), MAX_DAYS_BACK);
    setRecentEntries(recent);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    if (containerRef.current) {
      const clamped = Math.max(-80, Math.min(80, touchDeltaX.current));
      containerRef.current.style.transform = `translateX(${clamped}px)`;
      containerRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = "";
      containerRef.current.style.transition = "";
    }
    const threshold = 60;
    if (touchDeltaX.current < -threshold && offset < MAX_DAYS_BACK) {
      setOffset((o) => o + 1);
    } else if (touchDeltaX.current > threshold && offset > 0) {
      setOffset((o) => o - 1);
    }
  };

  const conflicts = new Map<MuscleGroup, { source: MuscleGroup; daysAgo: number }>();
  for (const group of MUSCLE_GROUPS) {
    const conflict = getConflicts(group, recentEntries, currentDate);
    if (conflict) {
      conflicts.set(group, conflict);
    }
  }

  return (
    <div
      className="day-view"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="day-header">
        <button
          className="nav-arrow"
          onClick={() => setOffset((o) => Math.min(o + 1, MAX_DAYS_BACK))}
          disabled={offset >= MAX_DAYS_BACK}
          aria-label="Previous day"
        >
          &lsaquo;
        </button>
        <div className="day-label">
          <span className="day-name">{dayLabel(currentDate)}</span>
          {offset > 0 && <span className="day-date">{currentDate}</span>}
        </div>
        <button
          className="nav-arrow"
          onClick={() => setOffset((o) => Math.max(o - 1, 0))}
          disabled={offset <= 0}
          aria-label="Next day"
        >
          &rsaquo;
        </button>
      </header>

      <div className="muscle-grid" ref={containerRef}>
        {loading
          ? null
          : MUSCLE_GROUPS.map((group) => {
              const isSelected = selected.includes(group);
              const conflict = conflicts.get(group);
              const isConflicted = !!conflict && !isSelected;

              return (
                <button
                  key={group}
                  className={[
                    "muscle-btn",
                    isSelected && "muscle-btn--selected",
                    isSelected && conflict && "muscle-btn--selected-warn",
                    isConflicted && "muscle-btn--conflicted",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleToggle(group)}
                >
                  <span className="muscle-btn__name">
                    {DISPLAY_LABELS[group]}
                  </span>
                  {conflict && (
                    <span className="muscle-btn__badge">
                      {conflict.source === group
                        ? `${conflict.daysAgo}d ago`
                        : `${DISPLAY_LABELS[conflict.source]} ${conflict.daysAgo}d`}
                    </span>
                  )}
                </button>
              );
            })}
      </div>
    </div>
  );
}
