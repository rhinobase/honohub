"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

export type { RichTextProps } from "./type";

export const RichTextField = dynamic(
  () => import("./RichText").then((mod) => mod.RichText),
  {
    ssr: false,
  },
) as () => ReactNode;
