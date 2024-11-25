import { FormMode } from "@honohub/shared";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { PageHeader, PageTitle } from "../../components/Header";
import { useCollectionFormData } from "../../queries/collections/useCollectionFormData";
import type { CollectionType } from "../../types";
import { getSingularLabel } from "../../utils";
import { DocumentForm } from "./Form";

export type DocumentPage = Omit<CollectionType, "columns">;

export function DocumentPage({ fields, slug, label }: DocumentPage) {
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

  return (
    <>
      <PageHeader>
        <PageTitle className="capitalize">
          {formType} {getSingularLabel(label)}
        </PageTitle>
      </PageHeader>
      <FormProvider {...methods}>
        <DocumentForm fields={fields} slug={slug} isLoading={isLoading} />
      </FormProvider>
    </>
  );
}
