import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    devServer({
      adapter,
      entry: "server/index.ts",
      exclude: [...defaultOptions.exclude, "/assets/**", "/app/**"],
      injectClientScript: false,
    }),
  ],
});
