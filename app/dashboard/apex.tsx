"use client";

import { APEX_COLORS, type ApexSeries, apexBase, CHART_SPECS } from "@viliha/vui-core";

// Re-exported so the pages that already read these from here keep working: the options moved to
// `@viliha/vui-core` because the Vue edition draws from the same object (`PD-128`).
export { APEX_COLORS, type ApexSeries, apexBase };

import dynamic from "next/dynamic";
import * as React from "react";

/**
 * ApexCharts, loaded in the browser and nowhere else.
 *
 * `apexcharts` touches `window` while its module is being evaluated, and `"use client"` does not stop
 * a module being *evaluated* during server rendering: it says where the component runs, not where the
 * import does. That is the same trap `jsvectormap` fell into (`PD-059`), and a server render dies with
 * `ReferenceError: window is not defined` without a guard.
 *
 * **`next/dynamic` with `ssr: false`, which is the framework's own answer to exactly this**, and it
 * was `React.lazy` behind a hand-rolled mount gate. That gate existed for a reason that no longer
 * applies: the demo used to be a static export, `ssr: false` marks a route
 * `BAILOUT_TO_CLIENT_SIDE_RENDERING`, and the HTML edition's page emitter then classified `/`,
 * `/bar-chart` and `/line-chart` as not static-safe, so the free download had no dashboard. There is no
 * export and no emitter here, so the idiomatic call is available and is the one to make: one line
 * instead of a `React.lazy`, a `mounted` state, an effect and a `Suspense`, and the `loading` option
 * gives the same reserved box the placeholder did.
 *
 * `ssr: false` is legal here because this file is a client component. Next would reject it in a server
 * component, which is the check that keeps the boundary honest.
 *
 * One wrapper rather than a call per chart, because five copies of this reasoning is five places for
 * the next person to get it wrong.
 */

/**
 * The reserved box, so a card does not resize when the canvas arrives.
 *
 * Rendered on the server, during hydration, and while the chunk downloads: the same element in all
 * three, which is what keeps the client's first paint identical to the server's.
 *
 * **The height arrives as a custom property, not a prop.** `next/dynamic` takes one `loading`
 * component for the whole import, so it cannot be handed a per-chart number; the wrapper below sets
 * `--vui-chart-height` from the chart's own spec and this reads it. The alternative is a `dynamic()`
 * call per height, which would load the library once per distinct number.
 */
function ChartPlaceholder() {
  return (
    <div
      className="min-h-(--vui-chart-height) w-full animate-pulse rounded-lg bg-muted/50"
      aria-hidden="true"
    />
  );
}

/** The library, in the browser only. Declared after the placeholder because it names it. */
const ApexChartClient = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <ChartPlaceholder />,
});

export function ApexChart(props: {
  /**
   * Which chart, by name, resolved from `CHART_SPECS` in `@viliha/vui-core`.
   *
   * **The name is the whole configuration**, and that is the point: the HTML edition's pages are this
   * markup with the framework stripped, so there is no component left to ask what to draw. The mount
   * point carries the name, `vui-charts.js` looks it up in the same registry, and a chart therefore
   * cannot differ between the editions by construction (`PD-147`). Passing type, height, series and
   * options here instead would be a second copy of every chart, one per edition.
   */
  name: keyof typeof CHART_SPECS;
}) {
  // `CHART_SPECS` is a `Record<string, ...>`, so the prop type promises nothing the compiler can
  // check: a typo used to reach the browser as "is not a function" from inside the chart. Named here
  // instead, which is the same failure with the chart's name in it.
  const spec = CHART_SPECS[props.name];
  if (!spec) throw new Error(`ApexChart: no chart named "${props.name}" in CHART_SPECS`);
  const { type, height, series, options, ariaLabel } = spec();

  return (
    // **No height on this box at all.** `height` pinned it and the chart overflowed; `minHeight`
    // stopped it collapsing and the chart still overflowed, because the number is not the box's
    // problem: Apex renders its own inner div with an inline height and draws axis labels below the
    // plot, so whatever this wrapper is told, the rendered block can be taller. A wrapper with no
    // height is exactly as tall as its content, which is the only version that cannot overlap the
    // card underneath. The placeholder carries the height instead, so the card still reserves space
    // while the library loads.
    // `role="img"` with a name, and the drawing itself hidden. The alternative is exposing Apex's
    // own SVG, which is axis ticks and nothing a reader can act on.
    <div
      className="w-full"
      role="img"
      aria-label={ariaLabel}
      data-vui-chart={props.name}
      // Read by `ChartPlaceholder`, which `next/dynamic` renders and this component cannot pass props to.
      style={{ "--vui-chart-height": `${height}px` } as React.CSSProperties}
    >
      {/* The drawing is hidden on a wrapper this component owns, rather than by passing `aria-hidden`
          into `react-apexcharts` and trusting it to forward an unknown prop to its own div. */}
      <div aria-hidden="true">
        <ApexChartClient
          // `ChartSpec.type` is `string`, because `@viliha/vui-core` is read by four editions and only
          // this one has Apex's own union to name. The cast is to the component's own prop type rather
          // than `any`, so a chart spec naming something Apex cannot draw still fails here.
          type={type as React.ComponentProps<typeof ApexChartClient>["type"]}
          height={height}
          // biome-ignore lint/suspicious/noExplicitAny: Apex types `series` as a union its own
          // option builders do not satisfy; the two shapes it accepts are in this component's props.
          series={series as any}
          options={options}
        />
      </div>
    </div>
  );
}
