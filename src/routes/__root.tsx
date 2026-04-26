import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorFallback";

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  ),
});
