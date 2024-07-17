import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { createHub } from "honohub";
import hubConfig from "../hub.config";

const app = new Hono().route("/", createHub(hubConfig));

app.use(
  "/*",
  serveStatic({
    root: "./apps/sandbox/dist",
  }),
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
