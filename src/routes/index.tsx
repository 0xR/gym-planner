import { createFileRoute } from "@tanstack/react-router";
import { DayView } from "../components/DayView";
import { fetchDayData } from "../lib/dayData";
import { today } from "../lib/dates";

export const Route = createFileRoute("/")({
  loader: () => fetchDayData(today()),
  component: DayView,
});
