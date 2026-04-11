import { createFileRoute } from "@tanstack/react-router";
import { DayView } from "../components/DayView";

export const Route = createFileRoute("/")({
  component: DayView,
});
