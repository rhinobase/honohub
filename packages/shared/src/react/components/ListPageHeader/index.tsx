import { Spinner } from "@rafty/ui";
import type { PropsWithChildren } from "react";
import { HasCrudPermission, HasDevPermission } from "../../permissions";
import { CollectionPermission } from "../../utils";
import { PageHeader } from "../PageHeader";
import { AddButton } from "./AddButton";
import { IDCopyButton } from "./IDCopyButton";
import { OptionsMenu } from "./OptionsMenu";

export type ListPageHeader = PropsWithChildren<
  {
    name: {
      singular: string;
      plural: string;
    };
    icon: PageHeader["icon"];
    isFetching: boolean;
  } & OptionsMenu
>;

export function ListPageHeader({
  name,
  icon,
  isFetching,
  children,
  ...props
}: ListPageHeader) {
  return (
    <PageHeader title={name?.plural} icon={icon}>
      <HasDevPermission>
        <IDCopyButton />
      </HasDevPermission>
      <div className="flex-1" />
      {isFetching && <Spinner />}
      <HasCrudPermission type={CollectionPermission.CREATE}>
        <AddButton name={name?.singular} />
      </HasCrudPermission>
      {children}
      <OptionsMenu {...props} />
    </PageHeader>
  );
}
