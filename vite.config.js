import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TourBlog/",
  build: {
    // outDir: 'nulp-s4-web-lab4',
    publicPath: "/",
    emptyOutDir: true, // also necessary
  },
  server: {
    historyApiFallback: true, // Ensures SPA fallback
  },
});
