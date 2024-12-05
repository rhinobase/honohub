import { HasStaffPermission } from "@honohub/shared";
import type { PropsWithChildren } from "react";

export default function OrganizationManageLayout(props: PropsWithChildren) {
  return <HasStaffPermission>{props.children}</HasStaffPermission>;
}
