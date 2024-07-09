import { createGraphiQLFetcher } from "@graphiql/toolkit";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import { useMemo } from "react";

export type GraphQLEditorProps = {
  endpoint: string;
};

export function GraphQLEditor(props: GraphQLEditorProps) {
  const fetcher = useMemo(
    () => createGraphiQLFetcher({ url: props.endpoint }),
    [props.endpoint],
  );
  return <GraphiQL fetcher={fetcher} />;
}
