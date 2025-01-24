import type { GlobalPlugin } from "../types";
import { createRoutes } from "./createRoutes";

export function useRestAPI(): GlobalPlugin {
  return {
    name: "honhub-rest-api",
    bootstrap(props) {
      for (
        let index = props.config.collections.length - 1;
        index >= 0;
        index--
      ) {
        const collection = props.config.collections[index];
        props.app.route(
          `collections/${collection.slug}`,
          createRoutes(props.config, collection),
        );
      }
      return props.app;
    },
  };
}
