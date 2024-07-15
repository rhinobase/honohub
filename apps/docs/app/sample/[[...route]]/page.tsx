"use client";
import { Honohub } from "@honohub/react";
import { useIsClient } from "@uidotdev/usehooks";

export default function SamplePage() {
  const isClient = useIsClient();

  if (!isClient) return;

  return <Honohub basePath="/sample" />;
}
