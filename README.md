# VuiAdmin Next.js — Free Next.js Tailwind Admin Dashboard Template

VuiAdmin is a free and open-source admin dashboard template built on **Next.js and Tailwind CSS**, from
[VILIHA](https://viliha.com). Nineteen screens, MIT licensed, on the same design system as the paid
editions — so what you evaluate here is what you build with.

This is the **Next.js** edition: App Router, server components by default, prerendered to static HTML.
Every screen renders from fixtures in its own file, so you can open one, read it top to bottom, and see
exactly where your data goes.

## Overview

* Next.js 16 (App Router, Turbopack)
* React 19
* TypeScript
* Tailwind CSS v4
* ApexCharts, FullCalendar and jsvectormap for the data screens

The components come from `@viliha/vui-react` and its framework-free half `@viliha/vui-core`, both
vendored under [`packages/`](./packages) so a clone installs with nothing private in the way.

### Quick links

* [🚀 Live demo](https://nextjs.viliha.com)
* [⚛️ React edition](https://github.com/myviliha/free-reactjs-admin-dashboard) — the same nineteen
  screens as a plain Vite SPA
* [✨ VILIHA](https://viliha.com)
* [⚡ Pro](https://viliha.com) — the server-backed record workflow, more dashboards, more screens

## Getting started

### Prerequisites

* Node.js 20.x or later

### Install and run

```bash
git clone git@github.com:myviliha/free-nextjs-admin-dashboard.git
cd free-nextjs-admin-dashboard
npm install
npm run dev
```

The dev server listens on [http://localhost:3000](http://localhost:3000).

### Scripts

| Script                | What it does                                        |
| --------------------- | --------------------------------------------------- |
| `npm run dev`         | Next dev server on port 3000                        |
| `npm run build`       | Production build                                    |
| `npm start`           | Serve the exported `out/` on port 3000 (run `build` first) |
| `npm run check-types` | `tsc --noEmit`                                      |
| `npm test`            | Route tree, sidebar and fixture checks (`vitest`)   |

### Configuration

There is nothing to configure to run the demo. Two optional keys change who the footer credits, so a
team shipping this template does not have to edit a component to put their own name on it:

```bash
cp .env.local.example .env.local
```

| Key                     | Default              | What it sets                              |
| ----------------------- | -------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_NAME` | `VILIHA`             | The name in the footer, rendered verbatim |
| `NEXT_PUBLIC_SITE_URL`  | `https://viliha.com` | Where that name links                     |

Both are inlined into the browser bundle at build time, so changing one needs a rebuild.

## The nineteen routes

Sixteen behind the shell, two auth screens outside it, and a 404.

| Behind the shell                                                                    | Outside it |
| ----------------------------------------------------------------------------------- | ---------- |
| `/` dashboard, `/calendar`, `/profile`, `/form-elements`, `/basic-tables`, `/blank` | `/signin`  |
| `/alerts`, `/avatars`, `/badge`, `/buttons`, `/images`, `/videos`, `/modals`         | `/signup`  |
| `/line-chart`, `/bar-chart`, `/layouts`                                             | `/error-404` |

`FREE_NAV` in `@viliha/vui-core` is the one list the sidebar and the route set both read, so they
cannot disagree, and `FREE_ROUTES` is derived from it. Every other edition of this demo reads the same
list, which is why it lives in the package rather than in `app/nav.ts`.

`routes.test.ts` walks `app/` and holds what it finds against that list and against the sidebar, in
both directions: a nav item with no page is a link to a 404, and a page with no nav item is a page
nobody can reach. Both survive a screenshot, so neither is left to inspection.

## Which Next.js features this uses, and why

The point of a Next edition is the framework, so it uses it rather than shipping a React app that
happens to live inside `app/`:

* **Server components by default.** Fifteen of the nineteen pages ship no JavaScript of their own. The
  four that need state — calendar, layouts and the two chart pages — are split: a server `page.tsx`
  owns the `metadata`, and a client component beside it does the work. That split is not decoration;
  `metadata` cannot be exported from a `"use client"` module, which is why those four routes once had
  no title of their own and inherited the layout's default.
* **`metadata` per route**, with a template in the root layout, so a tab reads
  `Basic Tables · VuiAdmin free`. **`viewport`** is a separate export, as Next has required since 14 —
  left inside `metadata`, `themeColor` is silently ignored and nothing tells you.
* **`loading.tsx` in the shell route group**, so a navigation paints a skeleton *inside* the sidebar and
  header instead of blanking them. Next wraps the segment in `<Suspense>` for you; the placement is the
  whole decision.
* **`error.tsx` and `global-error.tsx`** — a recoverable boundary using Next's `reset`, and a last
  resort for the root layout itself throwing, which `error.tsx` cannot catch.
* **`not-found.tsx`** for unmatched addresses, sharing one component with the `/error-404` route the
  sidebar links to on purpose.
* **`next/image`** (imported as `NextImage`) for the logo and the photograph gallery. A static export
  has no route handlers, so the optimiser cannot run and `images.unoptimized` is required — the
  components keep what it was wrapping (`width`/`height` reserving the layout, `loading` deferring what
  is below the fold, `sizes` letting the browser choose) and lose only the resizing. The gallery
  originals are 252px wide, so there was little to resize.
* **`next/link`** (as `NextLink`) for every internal navigation, injected into the design system's shell
  as a prop — the component package has no framework router of its own, and must not gain one.
* **`next/font`** self-hosts Outfit at build time, so there is no third-party font request and the demo
  renders in the right face offline.
* **`next/dynamic` with `ssr: false`** for ApexCharts, which touches `window` while its module
  evaluates. Its `loading` option reserves the chart's box.
* **`next.config.ts`**, typed, so a misspelled option is an error rather than a setting that quietly
  does nothing.

## Deploying

`npm run build` writes `out/`: a folder of static HTML, one file per route, with no Node process behind
it. `npm start` serves it locally. Upload it anywhere.

This repository publishes itself.
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) type-checks, tests and builds on every
push to `main`, then deploys to GitHub Pages at [nextjs.viliha.com](https://nextjs.viliha.com). A pull
request runs the same checks and stops before the deploy.

Two files in `public/` are load-bearing and ship inside the build rather than being set once in the
repository settings:

* **`CNAME`** carries the custom domain. Pages re-reads it on every deploy, so a build without it
  drops the domain.
* **`.nojekyll`** stops Pages ignoring `_next/`, which it otherwise would for beginning with an
  underscore — that failure serves the HTML with none of its CSS or JavaScript.

`basePath` is not set, which is correct for a domain of its own. Serving from a
`<user>.github.io/<repo>` URL instead needs `basePath: "/<repo>"` in `next.config.ts`, so the asset
URLs carry the subdirectory.

Deep links need no configuration: the export writes `alerts.html` beside `index.html` for every route,
so `/alerts` is a real file, and `not-found.tsx` becomes the `404.html` Pages serves for anything
unmatched.

If you would rather run this on a Node host — Vercel, a container — remove `output: "export"` and
`images: { unoptimized: true }` from `next.config.ts`. You get the image optimiser back and `npm start`
becomes `next start`.

## What's in it

* **Dashboard** — metrics, monthly sales and target, statistics, a demographic world map, recent orders
* **Calendar** — FullCalendar with add, edit and delete
* **User Profile** — profile, security and danger-zone cards with edit dialogs
* **Forms** — the full input set: text, select, multi-select, date, time, radio, checkbox, switch, file
  upload, password
* **Tables** — recent deals, top products, latest transactions, featured campaigns, with search, filter
  and row actions
* **Charts** — line and bar
* **UI elements** — alerts, avatars, badges, buttons, images, modals, videos
* **Authentication** — sign in and sign up on a split-screen layout
* **Pages** — a blank starting point, six shell layouts, and a 404

Plus the things a dashboard is judged on rather than counted by: a collapsible sidebar that keeps its
state across navigation, a rail mode with flyout submenus, dark mode, a route progress bar, and
`aria-current` on the row you are actually on.

### What is deliberately not here

The searchable and multi-select dropdowns, drag-and-drop upload, the advanced data table and the other
dashboards. Those are the paid tier, and they are **absent** rather than shown disabled: a control a
reader cannot use is worse than one they can see is not included.

## Project layout

```
app/
  layout.tsx          root layout: metadata, viewport, next/font
  loading.tsx         route-level loading UI outside the shell
  error.tsx           recoverable error boundary
  global-error.tsx    the root layout itself failing
  not-found.tsx       unmatched addresses
  skeleton.tsx        the one box every loading.tsx is built from
  (shell)/            the sixteen screens with sidebar and header
    layout.tsx        the shell, and the layout provider above it
    loading.tsx       the skeleton that renders inside the shell
  (auth)/             sign in and sign up, split-screen, no navigation
  error-404/          the 404 the sidebar links to on purpose
  dashboard/          the dashboard's cards, charts and map
  globals.css         Tailwind plus the design system's tokens
public/
  CNAME               the custom domain, read by Pages on every deploy
  .nojekyll           stops Pages dropping _next/ for its leading underscore
packages/
  vui-core/           framework-free half: tokens, class strings, fixtures, the route list
  vui-react/          the React components
routes.test.ts        the sidebar and the route tree, held against each other
fixtures.test.ts      the demo names no real person
```

## Free and Pro

The free edition is this repository: nineteen screens and 64 component families, MIT licensed, with no
account and no key. The Pro tier adds the server-backed record workflow — list, detail, create, edit and
delete against your own API — along with more dashboards and the rest of the component catalogue.

VILIHA offers comprehensive templates: the same dashboard in **React, Next.js, Vue, Angular, HTML and
Laravel**, built on one design system, so a team can change stack without changing product. See
[viliha.com](https://viliha.com).

## License

MIT. Use it commercially, fork it, ship it; keep the licence notice.

## Support

If this is useful, a star on GitHub helps. Issues and pull requests are welcome.
