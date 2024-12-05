import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@honohub/shared";
import { PasswordForm } from "./Form";

export default function PasswordPage() {
  return (
    <div className="space-y-5">
      <PageHeader icon={ShieldExclamationIcon} title="Change Password" />
      <PasswordForm />
    </div>
  );
}
