import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createHub } from "honohub";
import hubConfig from "../hub.config";

const app = new Hono().route("/", createHub(hubConfig));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
