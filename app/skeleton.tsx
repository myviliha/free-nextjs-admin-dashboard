import { cn } from "@viliha/vui-core";

/**
 * The one shape every `loading.tsx` in this app is built from.
 *
 * A skeleton is a box that pulses, and writing that box in four files is four chances to pick a
 * different radius or a different grey. `bg-muted` rather than a literal, so it follows a theme
 * switch like everything else does.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      // A skeleton is the *absence* of content. Announcing it would have a screen reader read
      // "loading" boxes; the route's own heading announces the page when it arrives.
      aria-hidden="true"
    />
  );
}
