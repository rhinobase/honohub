"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ArchiveBoxIcon } from "@heroicons/react/24/solid";
import {
  IDValidator,
  PageHeader,
  StaticCollection,
  useManageDocument,
} from "@honohub/shared";
import { Button } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleForm } from "../Form";

export default function UpdateRolePage() {
  return (
    <IDValidator>
      <UpdateRoleRender />
    </IDValidator>
  );
}

function UpdateRoleRender() {
  const pathname = usePathname();
  const { data, isLoading } = useManageDocument({
    slug: StaticCollection.ROLES,
  });

  return (
    <>
      <PageHeader icon={PencilIcon} title="Update Role">
        <div className="flex-1" />
        <Link href={`${pathname}/history`}>
          <Button leftIcon={<ArchiveBoxIcon className="size-4" />}>
            History
          </Button>
        </Link>
      </PageHeader>
      <RoleForm data={data} isLoading={isLoading} />
    </>
  );
}
