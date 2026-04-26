import "./ErrorFallback.css";

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="error-fallback" role="alert">
      <p className="error-fallback__title">Something went wrong</p>
      <pre className="error-fallback__message">{message}</pre>
      <button className="error-fallback__retry" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}
