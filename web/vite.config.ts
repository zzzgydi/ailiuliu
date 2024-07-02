import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pages from "vite-plugin-pages";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    pages({
      dirs: ["app/pages"],
    }),
    tsconfigPaths(),
  ],
});
