import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "CurseForge",
      fileName: "index",
    },
  },
});
