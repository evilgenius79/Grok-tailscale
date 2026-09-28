import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const direct = path.join(root, "src/lib/mesh/transport.direct.ts");

function phoneApiPlugin(): Plugin {
  return {
    name: "meshwarden-phone-api",
    enforce: "pre",
    resolveId(source, importer) {
      if (!importer) return null;
      const fromStore = importer.endsWith(`${path.sep}src${path.sep}lib${path.sep}mesh${path.sep}store.ts`);
      if (fromStore && (source === "./api" || source === "./api.ts")) return direct;
      return null;
    },
  };
}

export default defineConfig({
  root,
  publicDir: false,
  base: "./",
  plugins: [phoneApiPlugin(), tailwindcss(), react()],
  build: {
    outDir: path.join(root, "android/app/src/main/assets/www"),
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: path.join(root, "android-ui/index.html"),
      output: { inlineDynamicImports: true },
    },
  },
});
