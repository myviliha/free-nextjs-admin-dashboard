import type { NextConfig } from "next";

/**
 * The free edition's Next.js demo: nineteen screens on the same design system as the paid editions.
 *
 * **A static export, served from GitHub Pages at nextjs.viliha.com.** `next build` writes `out/`, a
 * folder of HTML with no Node process behind it, which is the whole of what Pages can serve. The
 * alternative was `next start` on a host that runs Node, and for this app it buys nothing: every
 * screen renders from fixtures in its own file, so there is no request-time work to do.
 *
 * **`images.unoptimized` is not a preference, it is the consequence.** `next/image`'s optimiser is a
 * route handler, and a static export has no routes to handle: without this the build fails and names
 * this setting. The components keep everything else the optimiser was wrapping — `width`/`height` so
 * the layout reserves space, `loading` so below-the-fold photographs are deferred, `sizes` so the
 * browser picks — and lose only the resizing and the WebP conversion. The five gallery photographs are
 * 252px wide originals, so there was little to resize.
 *
 * **`next.config.ts`, not `.js`.** Next has typed its own config since 15, and the `.js` file this
 * replaced had to be reparsed as an ES module on every build because it used `import` without the
 * package declaring `"type": "module"`. Typed config also means a misspelled key is an error here
 * rather than a setting that silently does nothing.
 *
 * **No `basePath`.** The export used to carry `/preview/free-react`, because it was served out of a
 * marketing site's `public/` directory. It has its own domain now, so the app sits at the root and
 * every internal href is already correct. A `<user>.github.io/<repo>` URL would need it back.
 *
 * **`turbopack.root` is pinned at this directory.** `packages/vui-core` and `packages/vui-react` are
 * vendored here as `file:` dependencies, and Next reads that layout as a workspace it should look
 * above; it warns rather than guessing quietly, which is the right call and is what this answers.
 */
const nextConfig: NextConfig = {
  output: "export",
  // `@viliha/vui-*` ship TypeScript source rather than a build, so the bundler has to compile them.
  // This worked without the setting under npm by accident: npm symlinks a `file:` dependency back to
  // `packages/`, which is inside `turbopack.root`, so Turbopack treated it as project source. pnpm
  // copies the dependency into its store instead, the real path lands under `node_modules`, and the
  // build failed with "Unknown module type" on all 26 `.tsx` files. Naming the packages is what the
  // design system's own documentation asks for, and it is correct under every package manager.
  transpilePackages: ["@viliha/vui-core", "@viliha/vui-react"],
  images: { unoptimized: true },
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
