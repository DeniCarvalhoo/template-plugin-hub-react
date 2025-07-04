import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export default defineConfig(({}) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true, // ou '0.0.0.0'
      port: 5001,
      strictPort: true,
    },
  };
});
