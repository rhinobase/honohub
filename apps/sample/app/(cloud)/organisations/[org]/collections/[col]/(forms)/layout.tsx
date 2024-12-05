"use client";
import {
  CollectionPermission,
  HasCrudPermission,
  IDValidator,
} from "@honohub/shared";
import { FormMode } from "@honohub/shared";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { CollectionPreviewProvider } from "../Preview";

export default function CollectionLayout(props: PropsWithChildren) {
  const pathname = usePathname();
  const formMode = pathname.split("/").pop() as FormMode;

  const isCreateMode = formMode === FormMode.CREATE;

  return (
    <IDValidator>
      <HasCrudPermission
        type={
          isCreateMode
            ? CollectionPermission.CREATE
            : [CollectionPermission.VIEW, CollectionPermission.UPDATE]
        }
      >
        <CollectionPreviewProvider preview={isCreateMode ? "create" : "update"}>
          {props.children}
        </CollectionPreviewProvider>
      </HasCrudPermission>
    </IDValidator>
  );
}
