import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { FormMode } from "@honohub/shared";
import { Button, eventHandler, useBoolean } from "@rafty/ui";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { PageHeader, PageTitle } from "../../components/Header";
import { useCollectionFormData } from "../../queries/collections/useCollectionFormData";
import type { CollectionType } from "../../types";
import { getSingularLabel } from "../../utils";
import { DevToolPanel } from "./DevToolPanel";
import { DocumentForm } from "./Form";

export type DocumentPage = Omit<CollectionType, "columns">;

export function DocumentPage({ fields, slug, label }: DocumentPage) {
  const [isDevToolOpen, setDevToolOpen] = useBoolean();
  const { id } = useParams();
  const methods = useForm();

  const formType = id === "create" ? FormMode.CREATE : FormMode.UPDATE;

  const names = useMemo(
    () => Object.fromEntries(fields.map(({ name }) => [name, true])),
    [fields],
  );

  const { data, isLoading } = useCollectionFormData({ slug });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!data) return;

    const entries = Object.entries(data).filter(([name]) => names[name]);
    methods.reset(Object.fromEntries(entries));
  }, [data]);

  const handleToggleViewPanelOpen = eventHandler(() => setDevToolOpen());

  return (
    <>
      <PageHeader>
        <PageTitle>
          {formType === FormMode.CREATE ? "Create" : "Update"}{" "}
          {getSingularLabel(label)}
        </PageTitle>
        <div className="flex-1" />
        <Button
          leftIcon={<CodeBracketIcon className="size-5 stroke-2" />}
          onClick={handleToggleViewPanelOpen}
          onKeyDown={handleToggleViewPanelOpen}
          className="hidden md:flex"
        >
          DevTool
        </Button>
      </PageHeader>
      <div className="flex h-full overflow-hidden gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        <FormProvider {...methods}>
          <DocumentForm fields={fields} slug={slug} isLoading={isLoading} />
          {isDevToolOpen && <DevToolPanel schema={fields} />}
        </FormProvider>
      </div>
    </>
  );
}
