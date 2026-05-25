import { createFileRoute } from "@tanstack/react-router";
import { DayView } from "../components/DayView";
import { fetchDayData } from "../lib/dayData";
import { today } from "../lib/dates";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const date = search.date;
    if (typeof date === "string" && DATE_RE.test(date)) {
      return { date };
    }
    return {};
  },
  loaderDeps: ({ search }) => ({ date: search.date }),
  loader: ({ deps }) => fetchDayData(deps.date ?? today()),
  component: DayView,
});
