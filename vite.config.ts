/// <reference types="vitest/config" />
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

function buildCommit(): string {
  const fromCi = process.env.COMMIT_REF;
  if (fromCi) return fromCi.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "snapshot";
  }
}

function buildDate(): string {
  const now = new Date();
  const tz = "Europe/Amsterdam";
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
  }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return `${day} ${time}`;
}

export default defineConfig({
  define: {
    __BUILD_COMMIT__: JSON.stringify(buildCommit()),
    __BUILD_DATE__: JSON.stringify(buildDate()),
  },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: {
        preset: "minimal-2023",
        image: "public/favicon.svg",
        overrideManifestIcons: true,
      },
      manifest: {
        name: "Gym Planner",
        short_name: "Gym Planner",
        description: "Track muscle groups and plan recovery",
        theme_color: "#1a1a2e",
        background_color: "#1a1a2e",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
  test: {
    environment: "node",
  },
});
