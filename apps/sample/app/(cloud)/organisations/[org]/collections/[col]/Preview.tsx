"use client";
import { useCollection, useOrganization } from "@honohub/shared";
import type { CollectionPreviewType } from "@honohub/shared";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

export type CollectionPreviewProvider = PropsWithChildren<{
  preview: keyof CollectionPreviewType;
}>;

export function CollectionPreviewProvider(props: CollectionPreviewProvider) {
  const router = useRouter();
  const { current: currentOrganisation } = useOrganization();
  const { current } = useCollection();

  const preview = current?.preview?.[props.preview];

  // Post messaging for Preview(iframe)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to run only once
  useEffect(() => {
    if (!window || !preview) return;

    function handleMessage(event: MessageEvent) {
      const { data } = event;
      if (data.redirect) router.push(data.redirect);
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (preview?.type === 1) {
    const { domain, path } = preview;

    return (
      <div className="h-full">
        <iframe
          width="100%"
          height="100%"
          title="preview page"
          src={`https://${domain}.containers.rhinobase.io${path}?col_slug=${current.slug}&org_slug=${currentOrganisation?.slug}`}
        />
      </div>
    );
  }

  return props.children;
}
