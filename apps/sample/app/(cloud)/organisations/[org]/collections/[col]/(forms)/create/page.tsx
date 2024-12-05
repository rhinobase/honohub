"use client";
import { CodeBracketIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FormMode, PageHeader, useAuth, useCollection } from "@honohub/shared";
import { Button, eventHandler, useBoolean } from "@rafty/ui";
import { CollectionForm } from "../CollectionForm";

export default function CreateCollectionPage() {
  const { current: currentCollection } = useCollection();
  const [isDevToolOpen, setDevToolOpen] = useBoolean();
  const { profile } = useAuth();

  const handleToggleViewPanelOpen = eventHandler(() => setDevToolOpen());

  return (
    <>
      <PageHeader
        icon={PlusIcon}
        title={`Create ${currentCollection?.name.singular ?? ""}`}
      >
        <div className="flex-1" />
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
      <CollectionForm mode={FormMode.CREATE} open={isDevToolOpen} />
    </>
  );
}
