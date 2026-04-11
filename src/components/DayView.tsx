import { Suspense, use, useRef, useState } from "react";
import { MUSCLE_GROUPS, type MuscleGroup } from "../lib/types";
import { getConflicts } from "../lib/conflicts";
import { toggleMuscleGroup } from "../lib/db";
import { today, addDays, dayLabel } from "../lib/dates";
import { fetchDayData, optimisticToggle } from "../lib/dayData";
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
  const [offset, setOffset] = useState(0);
  const [, setVersion] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentDate = addDays(today(), -offset);

  const handleToggle = (group: MuscleGroup) => {
    optimisticToggle(currentDate, group);
    setVersion((v) => v + 1);
    toggleMuscleGroup(currentDate, group);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    if (gridRef.current) {
      const clamped = Math.max(-80, Math.min(80, touchDeltaX.current));
      gridRef.current.style.transform = `translateX(${clamped}px)`;
      gridRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (gridRef.current) {
      gridRef.current.style.transform = "";
      gridRef.current.style.transition = "";
    }
    const threshold = 60;
    if (touchDeltaX.current < -threshold && offset < MAX_DAYS_BACK) {
      setOffset((o) => o + 1);
    } else if (touchDeltaX.current > threshold && offset > 0) {
      setOffset((o) => o - 1);
    }
  };

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

      <Suspense fallback={<MuscleGridSkeleton />}>
        <MuscleGrid
          date={currentDate}
          gridRef={gridRef}
          onToggle={handleToggle}
        />
      </Suspense>
    </div>
  );
}

interface MuscleGridProps {
  date: string;
  gridRef: React.RefObject<HTMLDivElement | null>;
  onToggle: (group: MuscleGroup) => void;
}

function MuscleGrid({ date, gridRef, onToggle }: MuscleGridProps) {
  const { selected, recentEntries } = use(fetchDayData(date));

  const conflicts = new Map<
    MuscleGroup,
    { source: MuscleGroup; daysAgo: number }
  >();
  for (const group of MUSCLE_GROUPS) {
    const conflict = getConflicts(group, recentEntries, date);
    if (conflict) {
      conflicts.set(group, conflict);
    }
  }

  return (
    <div className="muscle-grid" ref={gridRef}>
      {MUSCLE_GROUPS.map((group) => {
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
            onClick={() => onToggle(group)}
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
  );
}

function MuscleGridSkeleton() {
  return (
    <div className="muscle-grid">
      {MUSCLE_GROUPS.map((group) => (
        <button key={group} className="muscle-btn" disabled>
          <span className="muscle-btn__name">{DISPLAY_LABELS[group]}</span>
        </button>
      ))}
    </div>
  );
}
