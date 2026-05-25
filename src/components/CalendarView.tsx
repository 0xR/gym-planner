import { use, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { fetchCalendarData } from "../lib/dayData";
import { groupEntriesByMonth, monthSummary, type DayCell, type MonthData } from "../lib/calendar";
import { today } from "../lib/dates";
import "./CalendarView.css";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const PULL_DOWN_THRESHOLD = 80;

export function CalendarView() {
  const entries = use(fetchCalendarData());
  const navigate = useNavigate();
  const todayDate = today();
  const months = groupEntriesByMonth(entries, todayDate);
  const hasAnyData = entries.length > 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const scrollTopAtStart = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    scrollTopAtStart.current = scrollRef.current?.scrollTop ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - touchStartY.current;
    const currentScrollTop = scrollRef.current?.scrollTop ?? 0;
    if (scrollTopAtStart.current === 0 && currentScrollTop === 0 && deltaY > PULL_DOWN_THRESHOLD) {
      navigate({ to: "/" });
    }
  };

  const goToDay = (date: string) => {
    navigate({ to: "/", search: { date } });
  };

  return (
    <div
      ref={scrollRef}
      className="calendar-view"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {months.map((m) => (
        <MonthSection
          key={`${m.year}-${m.month}`}
          month={m}
          showCounts={hasAnyData}
          onDayTap={goToDay}
        />
      ))}
    </div>
  );
}

interface MonthSectionProps {
  month: MonthData;
  showCounts: boolean;
  onDayTap: (date: string) => void;
}

function MonthSection({ month, showCounts, onDayTap }: MonthSectionProps) {
  const summary = monthSummary(month.cells);
  return (
    <section className="cal-month">
      <h2 className="cal-month__header">
        <span className="cal-month__name">
          {MONTH_NAMES[month.month - 1]} {month.year}
        </span>
        {showCounts && (
          <span className="cal-month__counts">
            {" · "}
            {summary.trained} trained
            {" · "}
            {summary.rest} rest
            {" · "}
            {summary.untouched} —
          </span>
        )}
      </h2>
      <div className="cal-dow" aria-hidden="true">
        {DOW.map((d, i) => (
          <span key={i} className="cal-dow__cell">
            {d}
          </span>
        ))}
      </div>
      <div className="cal-grid">
        {month.cells.map((cell, i) => (
          <CellView key={i} cell={cell} onTap={onDayTap} />
        ))}
      </div>
    </section>
  );
}

interface CellViewProps {
  cell: DayCell;
  onTap: (date: string) => void;
}

function CellView({ cell, onTap }: CellViewProps) {
  if (cell.kind === "padding") {
    return <span className="cal-cell cal-cell--padding" aria-hidden="true" />;
  }
  if (cell.kind === "future") {
    return (
      <span
        className={`cal-cell cal-cell--future${cell.isToday ? " cal-cell--today" : ""}`}
        aria-hidden="true"
      />
    );
  }

  const className = ["cal-cell", `cal-cell--${cell.kind}`, cell.isToday && "cal-cell--today"]
    .filter(Boolean)
    .join(" ");

  const label =
    cell.kind === "trained"
      ? `${cell.date}: ${cell.count} muscle ${cell.count === 1 ? "group" : "groups"}`
      : cell.kind === "rest"
        ? `${cell.date}: rest day`
        : `${cell.date}: nothing logged`;

  return (
    <button type="button" className={className} onClick={() => onTap(cell.date)} aria-label={label}>
      <span className="cal-cell__glyph">
        {cell.kind === "trained" ? cell.count : cell.kind === "rest" ? "R" : "·"}
      </span>
    </button>
  );
}
