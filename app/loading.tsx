import { Skeleton } from "./skeleton";

/**
 * The App Router's route-level loading UI, at the root.
 *
 * **This is what `loading.tsx` is for and why it is not a spinner.** Next wraps the segment in a
 * `<Suspense>` whose fallback is this file, so a navigation shows it *immediately* while the next
 * route's server components render — the reader gets a response on the click rather than after the
 * work. A spinner would say "something is happening"; a skeleton in the shape of the page says what
 * is about to arrive, which is what stops the layout jumping when it does.
 *
 * `app/(shell)/loading.tsx` is the one almost every route actually uses, because it renders *inside*
 * the shell and so leaves the sidebar and header alone. This root file covers the segments outside
 * that group: the two authentication screens and the 404.
 */
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}
