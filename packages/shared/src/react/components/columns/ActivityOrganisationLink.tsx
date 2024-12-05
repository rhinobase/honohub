"use client";
import { useField } from "duck-form";
import Link from "next/link";
import type { ColumnThreadProps } from "./types";

type Props = {
  name: string;
  slug: string;
};

export function ActivityOrganisationLink() {
  const { value } = useField<ColumnThreadProps<Props>>();

  return (
    <Link
      href={`/organisations/${value.slug}/`}
      className="truncate font-semibold text-primary-500 transition-all hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
    >
      {value.name}
    </Link>
  );
}
