import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {}, // ⬅️ necessário para IIFE funcionar corretamente no browser
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      formats: ["iife"],
      name: "PluginButtonCustom",
      fileName: () => "index.js",
    },
    rollupOptions: {
      treeshake: false,
    },
  },
  server: {
    host: true, // ou '0.0.0.0'
    port: 5001,
    strictPort: true,
  },
});
