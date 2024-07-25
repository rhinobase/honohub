# @honohub/vite

The `@honohub/vite` plugin is a Vite plugin which adds the HonoHub configurations to the Vite server, enabling the Vite server to serve the Admin Panel. Here is an example of how to use the `@honohub/vite` plugin -

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import honohub from "@honohub/vite";
import hubConfig from "./hub.config";

export default defineConfig({
  plugins: [
    react(),
    honohub({
      config: hubConfig, // Your hub configuration
      basePath: "/", // Base path for the admin panel
    }),
  ],
});
```

This will add the HonoHub configurations to the Vite server and serve the Admin Panel at the base path `/`. You can customize the base path and the hub configuration as per your requirements. Out of the box the `@honohub/vite` plugin uses the `@honohub/react` plugin to render the Admin Panel but you can use your own plugin to render the Admin Panel using the `generator` option.
