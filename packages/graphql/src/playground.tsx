import GraphiQL from "graphiql";

export function GraphQLEditor() {
  return (
    <GraphiQL
      fetcher={(graphQLParams) =>
        fetch("/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(graphQLParams),
        }).then((response) => response.json())
      }
    />
  );
}
