"use client";
import { Button } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader, PageTitle } from "../../Components";
import { CollectionTable } from "./Table";

export type CollectionViewPage<T> = CollectionTable<T>;

export function CollectionViewPage<T = unknown>(props: CollectionViewPage<T>) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

  return (
    <>
      <PageHeader className="justify-between">
        <PageTitle className="capitalize">{slug}</PageTitle>
        <Link href={`/collection/${slug}/create`}>
          <Button colorScheme="primary">Create</Button>
        </Link>
      </PageHeader>
      <CollectionTable {...props} />
    </>
  );
}
