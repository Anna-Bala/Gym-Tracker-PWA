import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@schemas": path.resolve(__dirname, "../schemas/src"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
    },
  },
  preview: {
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: ["gym-tracker-pwa.up.railway.app"],
  },
});
