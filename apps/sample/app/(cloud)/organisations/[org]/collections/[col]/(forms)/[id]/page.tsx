"use client";
import { CodeBracketIcon, PencilIcon } from "@heroicons/react/24/outline";
import {
  ArchiveBoxIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import {
  PageHeader,
  useAuth,
  useCollection,
  useCollectionDocumentData,
} from "@honohub/shared";
import { FormMode } from "@honohub/shared";
import { Button, eventHandler, useBoolean } from "@rafty/ui";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { CollectionForm } from "../CollectionForm";

export default function UpdateCollectionPage() {
  const { org, col, id } = useParams();
  const { profile } = useAuth();
  const pathname = usePathname();
  const [isDevToolOpen, setDevToolOpen] = useBoolean();

  const handleToggleViewPanelOpen = eventHandler(() => setDevToolOpen());

  const {
    collections,
    current: currentCollection,
    isLoading: isCollectionLoading,
  } = useCollection();

  const { data, isLoading } = useCollectionDocumentData();

  return (
    <>
      <PageHeader
        icon={PencilIcon}
        title={`Update ${currentCollection?.name.singular ?? ""}`}
      >
        <div className="flex-1" />
        {currentCollection?.preview?.view && (
          <Link
            href={`https://${currentCollection.preview.view.domain}.containers.rhinobase.io${currentCollection.preview.view.path}?_id=${id}&col_slug=${col}&org_slug=${org}`}
            target="_blank"
            rel="noopener"
          >
            <Button leftIcon={<ArrowTopRightOnSquareIcon className="size-4" />}>
              Preview
            </Button>
          </Link>
        )}
        <Link href={`${pathname}/history`}>
          <Button leftIcon={<ArchiveBoxIcon className="size-4" />}>
            History
          </Button>
        </Link>
        {profile?.dev && (
          <Button
            leftIcon={<CodeBracketIcon className="size-5 stroke-2" />}
            onClick={handleToggleViewPanelOpen}
            onKeyDown={handleToggleViewPanelOpen}
          >
            DevTool
          </Button>
        )}
      </PageHeader>
      <CollectionForm
        mode={FormMode.UPDATE}
        open={isDevToolOpen}
        data={data}
        isLoading={
          !collections ||
          !currentCollection ||
          isCollectionLoading ||
          !data ||
          isLoading
        }
      />
    </>
  );
}
