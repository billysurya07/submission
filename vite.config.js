import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

// Plugin untuk memastikan sw.js ter-copy ke dist
function copyServiceWorkerPlugin() {
  return {
    name: "copy-service-worker",
    apply: "build",
    writeBundle() {
      const srcPath = resolve(__dirname, "src", "public", "sw.js");
      const destPath = resolve(__dirname, "dist", "sw.js");

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log("✓ Service Worker copied to dist/sw.js");
      }
    },
  };
}

export default defineConfig({
  base: "/submission/",

  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),

  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  plugins: [copyServiceWorkerPlugin()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
