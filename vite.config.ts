import { defineConfig, type Plugin } from "vite";
import { readdirSync, rmSync } from "node:fs";

const MANIFEST_ID = "virtual:asset-manifest";
const RESOLVED_ID = "\0" + MANIFEST_ID;
const IMAGE_EXT = /\.(avif|webp|jpe?g|png)$/i;

/**
 * Lists the optimised images in public/assets/ as { "<name>": ["<name>.webp", "<name>-1280.webp", …] }.
 * Slots read this instead of probing URLs, so a missing image never produces a 404 in the console.
 * In dev the list updates by itself when a file is added or removed.
 */
function assetManifest(): Plugin {
  const list = () => {
    const out: Record<string, string[]> = {};
    try {
      for (const f of readdirSync("public/assets")) {
        if (!IMAGE_EXT.test(f)) continue;
        const base = f.replace(IMAGE_EXT, "").replace(/-\d+$/, "");
        (out[base] ??= []).push(f);
      }
    } catch { /* folder missing: no images yet */ }
    return out;
  };
  return {
    name: "asset-manifest",
    resolveId: (id) => (id === MANIFEST_ID ? RESOLVED_ID : undefined),
    load: (id) => (id === RESOLVED_ID ? `export default ${JSON.stringify(list())};` : undefined),
    configureServer(server) {
      const changed = (file: string) => {
        if (!/[\\/]public[\\/]assets[\\/]/.test(file) || !IMAGE_EXT.test(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", changed).on("unlink", changed);
    },
  };
}

export default defineConfig({
  plugins: [
    assetManifest(),
    {
      // public/references holds design reference images for development only – never ship them
      name: "drop-design-references",
      apply: "build",
      closeBundle() {
        rmSync("dist/references", { recursive: true, force: true });
      },
    },
  ],
});
