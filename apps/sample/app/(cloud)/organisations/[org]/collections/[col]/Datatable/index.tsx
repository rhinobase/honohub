"use client";
import {
  DataTable,
  ImageHeaderProvider,
  getCollectionQueryKey,
  queryValidation,
  useCollectionData,
  useCollectionHeaders,
} from "@honohub/shared";
import { useParams, useSearchParams } from "next/navigation";
import { ImageHeaderDialog } from "./ImageHeaderDialog";

export function CollectionDataTable() {
  const { org, col } = useParams();

  const searchParams = useSearchParams();
  const queryParams = queryValidation.parse(
    Object.fromEntries(searchParams.entries()),
  );

  const queryKey = getCollectionQueryKey({
    org,
    col,
    ...queryParams,
  });

  const { data: headers } = useCollectionHeaders();

  const { data, isLoading } = useCollectionData();

  return (
    <ImageHeaderProvider>
      <DataTable
        headers={headers ?? []}
        data={data}
        isLoading={isLoading}
        actionApiUrl={`/organisations/${org}/collections/${col}/actions`}
        dataQueryKey={queryKey}
      />
      <ImageHeaderDialog />
    </ImageHeaderProvider>
  );
}
