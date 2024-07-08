import type { AnyDrizzleDB } from "drizzle-graphql";
import type { GlobalPlugin } from "../types";
import { createRoutes } from "./createRoutes";

export function useRestAPI<
  Database extends AnyDrizzleDB<any>,
>(): GlobalPlugin<Database> {
  return {
    name: "honhub-rest-api",
    setup(props) {
      for (
        let index = props.config.collections.length - 1;
        index >= 0;
        index--
      ) {
        const collection = props.config.collections[index];
        props.app.route(
          `/${collection.slug}`,
          createRoutes(props.config, collection),
        );
      }
      return props.app;
    },
  };
}
