import honohub from "@honohub/vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import hubConfig from "./hub.config";

export default defineConfig({
  plugins: [nxViteTsPaths(), react(), honohub({ config: hubConfig })],
});
