import { createGraphiQLFetcher } from "@graphiql/toolkit";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import "@honohub/graphql/playground/page.esm.css";
import { useMemo } from "react";

export type GraphQLEditorProps = {
  endpoint: string;
};

export default function GraphQLEditor(props: GraphQLEditorProps) {
  const fetcher = useMemo(
    () => createGraphiQLFetcher({ url: props.endpoint }),
    [props.endpoint],
  );
  return <GraphiQL fetcher={fetcher} />;
}
