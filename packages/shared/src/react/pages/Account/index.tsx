import Link from "next/link";
import { Logo, PageHeader, ProfileMenu } from "../../components";
import { BasicInfoCard } from "./BasicInfo";
import { ContactInfoCard } from "./ContactInfo";
import { PasswordInfoCard } from "./PasswordInfo";

export function AccountPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-1.5 p-1.5 border-b border-secondary-200 dark:border-secondary-800">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex-1" />
        <ProfileMenu />
      </div>
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-3 md:gap-4 lg:gap-5 px-3 py-3 md:px-4 md:py-4 lg:px-0 lg:py-5">
        <PageHeader
          title="Personal Info"
          className="flex-col gap-0 lg:gap-0 items-start"
        >
          <p className="text-secondary-500 dark:text-secondary-300 text-sm md:text-base">
            Info about you and your preferences across rhinobase platform
          </p>
        </PageHeader>
        <BasicInfoCard />
        <ContactInfoCard />
        <PasswordInfoCard />
      </div>
    </div>
  );
}
