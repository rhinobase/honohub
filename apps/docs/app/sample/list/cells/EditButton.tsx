"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CellWrapper } from "./CellWrapper";

export function EditButton({ cell }: any) {
  const pathname = usePathname();

  const value = String(cell?.getValue());

  return (
    <CellWrapper value={value}>
      <Link href={`${pathname}/${value}`}>
        <Button variant="ghost" size="icon" className="ml-auto">
          <PencilIcon className="size-4 stroke-2" />
        </Button>
      </Link>
    </CellWrapper>
  );
}
