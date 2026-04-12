import { Suspense, use, useRef, useState } from "react";
import { MUSCLE_GROUPS, type MuscleGroup } from "../lib/types";
import { getConflicts } from "../lib/conflicts";
import { toggleMuscleGroup, toggleRestDay } from "../lib/db";
import { today, addDays, dayLabel } from "../lib/dates";
import {
  fetchDayData,
  optimisticToggle,
  optimisticToggleRestDay,
} from "../lib/dayData";
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
  traps: "Traps",
  forearms: "Forearms",
};

const MAX_DAYS_BACK = 7;
const MAX_DAYS_FORWARD = 7;

export function DayView() {
  const [offset, setOffset] = useState(0);
  const [, setVersion] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDate = addDays(today(), -offset);

  const handleToggle = (group: MuscleGroup) => {
    optimisticToggle(currentDate, group);
    setVersion((v) => v + 1);
    toggleMuscleGroup(currentDate, group);
  };

  const handleToggleRestDay = () => {
    optimisticToggleRestDay(currentDate);
    setVersion((v) => v + 1);
    toggleRestDay(currentDate);
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
    if (touchDeltaX.current > threshold && offset < MAX_DAYS_BACK) {
      setOffset((o) => o + 1);
    } else if (
      touchDeltaX.current < -threshold &&
      offset > -MAX_DAYS_FORWARD
    ) {
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
          <div className="day-name-row">
            <span className="day-name">{dayLabel(currentDate)}</span>
            {offset !== 0 && (
              <button
                className="today-btn"
                onClick={() => setOffset(0)}
                aria-label="Go to today"
              >
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="10" cy="10" r="7" />
                  <circle
                    cx="10"
                    cy="10"
                    r="2.5"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </button>
            )}
          </div>
          {offset !== 0 && <span className="day-date">{currentDate}</span>}
        </div>
        <button
          className="nav-arrow"
          onClick={() =>
            setOffset((o) => Math.max(o - 1, -MAX_DAYS_FORWARD))
          }
          disabled={offset <= -MAX_DAYS_FORWARD}
          aria-label="Next day"
        >
          &rsaquo;
        </button>
      </header>

      <Suspense fallback={<GridSkeleton />}>
        <MuscleGrid
          date={currentDate}
          containerRef={containerRef}
          onToggle={handleToggle}
          onToggleRestDay={handleToggleRestDay}
        />
      </Suspense>
    </div>
  );
}

interface MuscleGridProps {
  date: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onToggle: (group: MuscleGroup) => void;
  onToggleRestDay: () => void;
}

function MuscleGrid({
  date,
  containerRef,
  onToggle,
  onToggleRestDay,
}: MuscleGridProps) {
  const { selected, restDay, recentEntries } = use(fetchDayData(date));

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
    <div className="grid-container" ref={containerRef}>
      <div className={`muscle-grid${restDay ? " muscle-grid--rest" : ""}`}>
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
      <button
        className={`rest-day-btn${restDay ? " rest-day-btn--selected" : ""}`}
        onClick={onToggleRestDay}
      >
        Rest Day
      </button>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid-container">
      <div className="muscle-grid">
        {MUSCLE_GROUPS.map((group) => (
          <button key={group} className="muscle-btn" disabled>
            <span className="muscle-btn__name">{DISPLAY_LABELS[group]}</span>
          </button>
        ))}
      </div>
      <button className="rest-day-btn" disabled>
        Rest Day
      </button>
    </div>
  );
}
