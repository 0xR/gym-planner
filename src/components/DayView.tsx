import { Suspense, use, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { MUSCLE_GROUPS, type MuscleGroup, type DayEntry } from "../lib/types";
import { getConflicts } from "../lib/conflicts";
import { toggleMuscleGroup, toggleRestDay } from "../lib/db";
import { today, addDays, dayLabel } from "../lib/dates";
import { fetchDayData, optimisticToggle, optimisticToggleRestDay } from "../lib/dayData";
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

const MAX_DAYS_FORWARD = 7;
const VERTICAL_SWIPE_THRESHOLD = 80;

function getLastTrainedMap(
  entries: DayEntry[],
  currentDate: string,
): Partial<Record<MuscleGroup, number>> {
  const result: Partial<Record<MuscleGroup, number>> = {};
  const current = new Date(currentDate + "T00:00:00");

  for (const entry of entries) {
    if (entry.date >= currentDate) continue;
    if (entry.restDay) continue;
    const entryDate = new Date(entry.date + "T00:00:00");
    const daysAgo = Math.round((current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 0) continue;

    for (const muscle of entry.muscleGroups) {
      if (result[muscle] === undefined || daysAgo < result[muscle]!) {
        result[muscle] = daysAgo;
      }
    }
  }

  return result;
}

function ageColorClass(daysAgo: number): string {
  if (daysAgo <= 2) return "muscle-btn__age--recent";
  if (daysAgo <= 4) return "muscle-btn__age--moderate";
  if (daysAgo <= 6) return "muscle-btn__age--due";
  return "muscle-btn__age--overdue";
}

export function DayView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { date?: string };
  const [currentDate, setCurrentDate] = useState(() => search.date ?? today());
  const [, setVersion] = useState(0);
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const touchDeltaY = useRef(0);
  const gestureAxis = useRef<"horizontal" | "vertical" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBuildInfo) return;
    const id = window.setTimeout(() => setShowBuildInfo(false), 3000);
    return () => window.clearTimeout(id);
  }, [showBuildInfo]);

  const todayDate = today();
  const forwardOffsetFromToday = Math.round(
    (new Date(currentDate + "T00:00:00").getTime() - new Date(todayDate + "T00:00:00").getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const canGoForward = forwardOffsetFromToday < MAX_DAYS_FORWARD;
  const isToday = currentDate === todayDate;

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
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
    gestureAxis.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
    if (gestureAxis.current === null) {
      const absX = Math.abs(touchDeltaX.current);
      const absY = Math.abs(touchDeltaY.current);
      if (absX > 8 || absY > 8) {
        gestureAxis.current = absX > absY ? "horizontal" : "vertical";
      }
    }
    if (gestureAxis.current === "horizontal" && containerRef.current) {
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
    const horizontalThreshold = 60;
    if (gestureAxis.current === "horizontal") {
      if (touchDeltaX.current > horizontalThreshold) {
        setCurrentDate((d) => addDays(d, -1));
      } else if (touchDeltaX.current < -horizontalThreshold && canGoForward) {
        setCurrentDate((d) => addDays(d, 1));
      }
    } else if (gestureAxis.current === "vertical") {
      if (touchDeltaY.current > VERTICAL_SWIPE_THRESHOLD) {
        navigate({ to: "/calendar" });
      }
    }
    gestureAxis.current = null;
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
          onClick={() => setCurrentDate((d) => addDays(d, -1))}
          aria-label="Previous day"
        >
          &lsaquo;
        </button>
        <div className="day-label">
          <div className="day-name-row">
            <button
              className={`day-name${showBuildInfo ? " day-name--build-info" : ""}`}
              onClick={() => setShowBuildInfo((s) => !s)}
              aria-label={showBuildInfo ? "Hide build info" : "Show build info"}
            >
              {showBuildInfo ? `${__BUILD_COMMIT__} · ${__BUILD_DATE__}` : dayLabel(currentDate)}
            </button>
            {!isToday && !showBuildInfo && (
              <button
                className="today-btn"
                onClick={() => setCurrentDate(todayDate)}
                aria-label="Go to today"
              >
                <svg
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="10" cy="10" r="7" />
                  <circle cx="10" cy="10" r="2.5" fill="currentColor" stroke="none" />
                </svg>
              </button>
            )}
          </div>
          {!isToday && <span className="day-date">{currentDate}</span>}
        </div>
        <button
          className="nav-arrow"
          onClick={() => canGoForward && setCurrentDate((d) => addDays(d, 1))}
          disabled={!canGoForward}
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

function MuscleGrid({ date, containerRef, onToggle, onToggleRestDay }: MuscleGridProps) {
  const { selected, restDay, recentEntries } = use(fetchDayData(date));

  const conflicts = new Map<MuscleGroup, { source: MuscleGroup; daysAgo: number }>();
  for (const group of MUSCLE_GROUPS) {
    const conflict = getConflicts(group, recentEntries, date);
    if (conflict) {
      conflicts.set(group, conflict);
    }
  }

  const lastTrainedMap = getLastTrainedMap(recentEntries, date);

  const sortedGroups = [...MUSCLE_GROUPS].sort((a, b) => {
    const aAge = lastTrainedMap[a];
    const bAge = lastTrainedMap[b];
    // Both have ages: longest ago first
    if (aAge !== undefined && bAge !== undefined) return bAge - aAge;
    // Never trained = highest priority (treat as infinity)
    if (aAge !== undefined) return 1;
    if (bAge !== undefined) return -1;
    return 0;
  });

  return (
    <div className="grid-container" ref={containerRef}>
      <div className={`muscle-grid${restDay ? " muscle-grid--rest" : ""}`}>
        {sortedGroups.map((group) => {
          const isSelected = selected.includes(group);
          const conflict = conflicts.get(group);
          const isConflicted = !!conflict && !isSelected;
          const lastTrained = lastTrainedMap[group];
          const showAgeBadge =
            lastTrained !== undefined && (!conflict || conflict.source !== group);

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
              <span className="muscle-btn__name">{DISPLAY_LABELS[group]}</span>
              {showAgeBadge && (
                <span className={`muscle-btn__badge ${ageColorClass(lastTrained)}`}>
                  {lastTrained}d ago
                </span>
              )}
              {conflict && (
                <span className="muscle-btn__badge muscle-btn__badge--conflict">
                  <WarningIcon className="muscle-btn__conflict-icon" />
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

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path
        d="M6 1.2L11 10.2H1L6 1.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6 5v2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6" cy="8.7" r="0.7" fill="currentColor" />
    </svg>
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
