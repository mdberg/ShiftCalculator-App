import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Base path for the built site. Defaults to "/" for local dev; the GitHub Pages
// workflow sets BASE_PATH=/ShiftCalculator-App/ so assets resolve under the repo path.
const base = process.env.BASE_PATH || "/";

// Copy index.html to 404.html so GitHub Pages serves the SPA for unknown paths.
const spaFallback = (): Plugin => ({
  name: "spa-404-fallback",
  apply: "build",
  closeBundle() {
    const outDir = path.resolve(import.meta.dirname, "dist/public");
    const index = path.join(outDir, "index.html");
    if (fs.existsSync(index)) {
      fs.copyFileSync(index, path.join(outDir, "404.html"));
    }
  },
});

// Replit-only dev plugins are loaded only when running inside Replit.
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  base,
  plugins: [
    react(),
    spaFallback(),
    ...(isReplit
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
            m.default(),
          ),
        ]
      : []),
    ...(process.env.NODE_ENV !== "production" && isReplit
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
