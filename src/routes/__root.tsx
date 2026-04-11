import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        gap: "1rem",
        padding: "2rem",
        color: "var(--color-text, #e0e0e0)",
      }}
    >
      <p>Something went wrong</p>
      <pre style={{ fontSize: "0.8rem", opacity: 0.6 }}>{message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  ),
});
