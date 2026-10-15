import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Separate from the normal web build: inline scripts, styles and fonts so the
// learning app can also run from file:// without a development server.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: "portable", emptyOutDir: true },
});
