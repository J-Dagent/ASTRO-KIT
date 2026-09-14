import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  adapter: cloudflare(),
  integrations: [react()],
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
