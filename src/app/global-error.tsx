"use client";

import { useEffect } from "react";
import { captureException } from "~/lib/analytics";

// Replaces the root layout when it throws, so it renders its own document and
// gets no global styles — keep it plain.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  // Reporting to an external service once the error UI is shown is a genuine
  // Effect: it synchronises with something outside React.
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <main style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 500 }}>
            Something went wrong
          </h1>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
