import { createFileRoute } from "@tanstack/react-router";
import { CalendarView } from "../components/CalendarView";
import { fetchCalendarData } from "../lib/dayData";

export const Route = createFileRoute("/calendar")({
  loader: () => fetchCalendarData(),
  component: CalendarView,
});
