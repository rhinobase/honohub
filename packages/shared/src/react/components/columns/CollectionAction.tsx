import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { useField } from "duck-form";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCollection } from "../../providers";
import type { ColumnThreadProps } from "./types";

export function CollectionActionCell() {
  const pathname = usePathname();
  const { org: organization, col: collection } = useParams();

  const { current } = useCollection();
  const { value } = useField<ColumnThreadProps<string>>();

  return (
    <div className="flex items-center w-full justify-end gap-2">
      <Link href={`${pathname}/${value}`}>
        <Button size="icon" variant="ghost">
          <PencilIcon className="size-4 stroke-2" />
        </Button>
      </Link>
      {current?.preview?.view && (
        <Link
          href={`https://${current.preview.view.domain}.containers.rhinobase.io${current.preview.view.path}?_id=${value}&col_slug=${collection}&org_slug=${organization}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button size="icon" variant="ghost">
            <ArrowTopRightOnSquareIcon className="size-4 stroke-2" />
          </Button>
        </Link>
      )}
    </div>
  );
}
