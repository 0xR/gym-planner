/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
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
