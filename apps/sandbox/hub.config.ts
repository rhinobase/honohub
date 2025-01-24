import { useGraphQL } from "@honohub/graphql";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type Env, Hono, type Schema } from "hono";
import { logger } from "hono/logger";
import {
  type GlobalPluginSetupProps,
  defineCollection,
  defineHub,
} from "honohub";
import * as schema from "./src/db/schema";

const neonSql = neon(process.env.DATABASE_URL ?? "");
const db = drizzle(neonSql, { schema, logger: true });

const collection = defineCollection({
  slug: "todos",
  schema: schema.todos,
  queryKey: "id",
  admin: {
    label: { singular: "Todo", plural: "Todos" },
    fields: ["message", { name: "status", label: "Status", required: false }],
  },
  listSearchableFields: ["message"],
  pagination: {
    defaultLimit: 10,
  },
});

export default defineHub({
  db,
  serverUrl: "http://localhost:3000/",
  collections: [collection],
  plugins: [
    {
      name: "hono-logger",
      bootstrap: <E extends Env, P extends Schema, I extends string>(
        props: GlobalPluginSetupProps<E, P, I>,
      ) => {
        return new Hono<E, P, I>().use(logger()).route("/", props.app);
      },
    },
    useGraphQL({
      playground: {
        graphQLEndpoint: "http://localhost:3000/graphql",
      },
    }),
    {
      name: "dev",
      register: (config) => {
        config.routes[0].import =
          "../../../packages/graphql/src/playground.tsx";

        return config;
      },
    },
  ],
});
