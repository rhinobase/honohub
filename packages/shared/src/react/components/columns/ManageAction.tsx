import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { useField } from "duck-form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ColumnThreadProps } from "./types";

export function ManageActionCell() {
  const { value } = useField<ColumnThreadProps<string>>();
  const pathname = usePathname();

  return (
    <div className="flex w-full justify-end">
      <Link href={`${pathname}/${value}`}>
        <Button size="icon" variant="ghost">
          <PencilIcon className="size-4 stroke-2" />
        </Button>
      </Link>
    </div>
  );
}
