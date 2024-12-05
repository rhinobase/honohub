"use client";
import { PageHeader, FormMode } from "@honohub/shared";
import { PlusIcon } from "@heroicons/react/24/outline";
import { UserForm } from "../Form";

export default function CreateUserPage() {
  return (
    <>
      <PageHeader icon={PlusIcon} title="Create User" />
      <UserForm mode={FormMode.CREATE} />
    </>
  );
}