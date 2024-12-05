import { PlusIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@honohub/shared";
import { RoleForm } from "../Form";

export default function CreateRolePage() {
  return (
    <>
      <PageHeader icon={PlusIcon} title="Create Role" />
      <RoleForm />
    </>
  );
}
