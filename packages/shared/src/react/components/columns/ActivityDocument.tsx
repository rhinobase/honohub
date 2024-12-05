"use client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { useField } from "duck-form";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { History } from "../../types";
import type { ColumnThreadProps } from "./types";

export function ActivityDocument() {
  const { org } = useParams();
  const { value, row } =
    useField<ColumnThreadProps<History["collection"], History>>();

  return (
    <div className="flex justify-end">
      <Link
        href={`/organisations/${value.org?.slug ?? org}/collections/${
          value.slug
        }/${row.original.document}`}
      >
        <Button size="icon" variant="ghost">
          <ArrowTopRightOnSquareIcon className="size-4 stroke-2" />
        </Button>
      </Link>
    </div>
  );
}
