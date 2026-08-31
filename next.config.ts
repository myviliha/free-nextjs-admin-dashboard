import type { NextConfig } from "next";

/**
 * The free edition's Next.js demo: nineteen screens on the same design system as the paid editions.
 *
 * **`next.config.ts`, not `.js`.** Next has typed its own config since 15, and the `.js` file this
 * replaced had to be reparsed as an ES module on every build because it used `import` without the
 * package declaring `"type": "module"`. Typed config also means a misspelled key is an error here
 * rather than a setting that silently does nothing.
 *
 * **A server-rendered app, and it used to be a static export.** `output: "export"` was here because
 * the demo was served out of the storefront's `public/` directory, which also forced
 * `basePath: "/preview/free-react"` and `images: { unoptimized: true }`: three settings that existed
 * for where the app was hosted rather than for anything the app does. This repository is the app on
 * its own domain, so all three are gone, `next start` serves it, and `next/image` optimises the five
 * photographs and the logo instead of passing them through.
 *
 * **`turbopack.root` is the one thing left, and it is this directory.** The version of this pin that
 * used to sit here pointed three levels up, at a monorepo root, and `outputFileTracingRoot` came with
 * it. Neither is right any more — but the pin is still needed, because `packages/vui-core` and
 * `packages/vui-react` are vendored here as `file:` dependencies and Next reads that layout as a
 * workspace it should look above. It warns rather than guessing quietly, which is the right call and
 * is what this answers: the root is the repository, and it is the repository whichever machine the
 * clone is on.
 */
const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
