import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Konfiguracja Vite dla React + TypeScript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy backendu Django
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});
