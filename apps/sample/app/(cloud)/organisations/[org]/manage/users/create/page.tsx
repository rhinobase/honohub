"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormMode, PageHeader } from "@honohub/shared";
import { UserForm } from "../Form";

export default function CreateUserPage() {
  return (
    <>
      <PageHeader icon={PlusIcon} title="Create User" />
      <UserForm mode={FormMode.CREATE} />
    </>
  );
}
