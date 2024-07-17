import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import honohub from "../../packages/vite/src";
import hubConfig from "./hub.config";

export default defineConfig({
  plugins: [
    nxViteTsPaths(),
    react(),
    honohub({
      config: hubConfig,
      basePath: "/",
      build: {
        cache: "./apps/sandbox/.honohub",
        outDir: "../dist",
      },
    }),
  ],
});
