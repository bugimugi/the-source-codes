import { defineConfig } from "vite";
import { rmSync } from "node:fs";

export default defineConfig({
  plugins: [
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
