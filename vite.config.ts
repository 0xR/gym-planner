import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
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
        short_name: "Gym",
        description: "Track muscle groups and plan recovery",
        theme_color: "#1a1a2e",
        background_color: "#1a1a2e",
        display: "fullscreen",
        orientation: "portrait",
      },
    }),
  ],
});
