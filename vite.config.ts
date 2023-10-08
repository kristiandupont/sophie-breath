import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  esbuild: { jsxDev: false },
  build: { outDir: "docs" },
});
