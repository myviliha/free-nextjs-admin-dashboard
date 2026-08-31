"use client";

import { Button } from "@viliha/vui-react/button";
import * as React from "react";

import { GridShape } from "./grid-shape";

/**
 * The App Router's error boundary for this segment.
 *
 * **A `"use client"` file, and it has to be**: an error boundary catches a render that threw, which
 * is a thing only the client can recover from. Next passes it the error and a `reset` function that
 * re-renders the segment, so a transient failure costs a click rather than a reload.
 *
 * `not-found.tsx` and this file are different failures and so are different screens: one is an
 * address that does not exist, this is an address that exists and broke. Showing the 404 for both
 * tells a reader to check their spelling when the problem is ours.
 *
 * **`digest` and nothing else.** In production Next replaces the message with an opaque digest
 * precisely so a stack trace does not reach the browser, and printing the digest is what lets someone
 * match this screen to the line in the server log. The message is shown in development, where it is
 * the whole point.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // The one place this app logs. A boundary that swallows the error silently is how a bug in a demo
    // survives every screenshot.
    console.error(error);
  }, [error]);

  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center overflow-hidden p-6">
      <GridShape
        id="err-boundary-top"
        className="pointer-events-none absolute top-0 right-0 -z-10 w-full max-w-[250px] text-destructive/30 xl:max-w-[450px]"
      />

      <div className="mx-auto w-full max-w-[472px] text-center">
        <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          Something went wrong
        </p>
        <h1 className="text-lg font-semibold sm:text-xl">This screen failed to render</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "The error has been logged. Trying again is usually enough."}
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">digest: {error.digest}</p>
        ) : null}
        <Button size="lg" className="mt-8" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
