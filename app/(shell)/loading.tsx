import { Skeleton } from "../skeleton";

/**
 * The loading UI for everything inside the shell.
 *
 * **Placed in the route group rather than at the root, and that placement is the whole point.** A
 * `loading.tsx` replaces only its own segment, so this one renders where the page does: the sidebar,
 * the header and the footer stay on screen and stay interactive while the next route resolves. The
 * root file would blank all of it, which on a click in the sidebar looks like the app restarting.
 *
 * The shape is the shape of a page in this app — a title with a breadcrumb beside it, then cards —
 * because a skeleton that does not match what follows is a second layout shift rather than a fix for
 * the first.
 */
export default function ShellLoading() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Two rows of two, which is the widest any screen here starts with. `rounded-2xl` to match
            `--vui-card-radius`, so the boxes sit exactly where the cards will. */}
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </>
  );
}
