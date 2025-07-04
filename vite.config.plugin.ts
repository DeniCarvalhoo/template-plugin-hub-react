import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// vite.config.plugin.ts
import { defineConfig } from "vite";

const entry = process.env.ENTRY;
const pluginName = process.env.PLUGIN_NAME;

if (!entry || !pluginName) {
  throw new Error(
    "As variáveis de ambiente ENTRY e PLUGIN_NAME são obrigatórias.",
  );
}

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
});
