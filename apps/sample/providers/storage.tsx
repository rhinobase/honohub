"use client";
import {
  endpoint,
  getCloudinaryURL,
  getStorageQueryKey,
  handleError,
  queryValidation,
  useOrganization,
} from "@honohub/shared";
import { StorageProvider as SharedStorageProvider } from "@honohub/storage";
import axios from "axios";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";

export function StorageProvider(props: PropsWithChildren) {
  const { org } = useParams();
  const { current } = useOrganization();
  const searchParams = useSearchParams();
  const { search } = queryValidation.parse(
    Object.fromEntries(searchParams.entries()),
  );
  // @ts-expect-error
  const queryKey: string[] = getStorageQueryKey({ org, search });

  return (
    <SharedStorageProvider
      create={async ({ signature, file, config }) => {
        const form = new FormData();
        form.set("file", file);
        form.set("api_key", signature.apikey);
        form.set("timestamp", signature.timestamp);
        form.set("signature", signature.signature);
        form.set("public_id", signature.public_id);

        // Sending the request to upload the data and returning the response
        return axios
          .create(config)
          .post(
            `https://api.cloudinary.com/v1_1/${signature.cloudname}/auto/upload`,
            form,
          )
          .then((res) => res.data);
      }}
      update={(id: string, name: string) => {
        const public_id = id.split("/").slice(1).join("/");

        return endpoint.post(`/organisations/${org}/spaces/${public_id}`, {
          public_id: name,
        });
      }}
      remove={(id: string) => {
        const public_id = id.split("/").slice(1).join("/");

        return endpoint.delete(`/organisations/${org}/spaces/${public_id}`);
      }}
      usage={
        current
          ? Math.round((current.used * 100) / (1073741824 * current.allocated))
          : 0
      }
      // TODO: complete these
      onUsageChange={(usage) => {}}
      generateURL={(props) =>
        getCloudinaryURL(props.content, {
          filters: props.filters
            ? Object.entries(props.filters).map(
                ([key, value]) => `${key.slice(0, 1)}_${value}`,
              )
            : undefined,
          raw: props.raw,
        })
      }
      queryKey={queryKey}
      signature={async (file) => {
        const filename = file.name.split(".");
        filename.pop();

        return endpoint
          .post<Record<string, string>>(
            `/organisations/${org}/spaces/signature`,
            {
              filename: String(filename)
                .replace(/[^a-z0-9_]+/gi, "-")
                .replace(/^-|-$/g, "")
                .toLowerCase(),
            },
          )
          .then((res) => res.data);
      }}
      handleError={handleError}
      imageRender={(props) => <Image {...props} alt={props.alt} />}
    >
      {props.children}
    </SharedStorageProvider>
  );
}
