import type { Metadata } from "next";

import { CalendarScreen } from "./calendar-screen";

/**
 * The server half of this route, and it exists for one export.
 *
 * **`metadata` cannot be exported from a `"use client"` module**, and the screen has to be one: it
 * holds state, effects and event handlers. This route therefore shipped with no title of its own and
 * inherited the layout's default, "VuiAdmin free", while its siblings named themselves — a page whose
 * tab says the product name is a page a reader cannot find among ten open tabs.
 *
 * The split is the framework's answer to that: a server component owns the metadata and renders the
 * client component beneath it. Four routes in this app need it, and the other fifteen are server
 * components that export their own.
 */
export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return <CalendarScreen />;
}
