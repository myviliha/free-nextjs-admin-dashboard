"use client";

/**
 * The last resort: an error thrown by the **root layout itself**.
 *
 * `error.tsx` renders inside the layout that failed, so it cannot catch that layout throwing. This
 * one replaces the whole document, which is why it has to render its own `<html>` and `<body>` —
 * there is no layout left above it to provide them.
 *
 * **Deliberately plain, with inline styles.** The stylesheet is imported by the root layout, and this
 * file exists for the case where the root layout did not run. Reaching for a design-system component
 * here is reaching for the thing that may be the reason we are here.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100dvh",
          margin: 0,
          padding: "1.5rem",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.125rem", fontWeight: 600 }}>The application failed to start</h1>
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", opacity: 0.7 }}>
            Reloading the page is the only recovery from here.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "0.5rem", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", opacity: 0.7 }}>
              digest: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
