"use client";
import { ArrowRightIcon, PencilIcon } from "@heroicons/react/24/outline";
import {
  PageHeader,
  StaticCollection,
  useManageDocument,
} from "@honohub/shared";
import { FormMode } from "@honohub/shared";
import { Button } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserForm } from "../Form";
import { HistoryPanel } from "./HistoryPanel";

export default function UpdateUserPage() {
  const pathname = usePathname();
  const { data, isLoading } = useManageDocument({
    slug: StaticCollection.USERS,
  });

  return (
    <div className="flex flex-1 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
      <div className="w-full space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
        <PageHeader icon={PencilIcon} title="Update User">
          <div className="flex-1 xl:hidden" />
          <Link href={`${pathname}/activity`} className="xl:hidden">
            <Button
              rightIcon={<ArrowRightIcon className="size-3.5 stroke-[3]" />}
            >
              Activities
            </Button>
          </Link>
        </PageHeader>
        <UserForm mode={FormMode.UPDATE} data={data} isLoading={isLoading} />
      </div>
      <HistoryPanel />
    </div>
  );
}
