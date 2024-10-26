import { defineConfig } from "vite";
import path from "path";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact()],
  server: {
    host: true,
    port: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
