import { useIsClient } from "@uidotdev/usehooks";
import GraphiQL from "graphiql";

export function GraphQLEditor() {
  const isClient = useIsClient();

  if (isClient) return <></>;

  return (
    <GraphiQL
      fetcher={(graphQLParams) =>
        fetch("/graphql", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(graphQLParams),
        }).then((response) => response.json())
      }
    />
  );
}
