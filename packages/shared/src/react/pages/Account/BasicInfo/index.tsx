"use client";
import { Avatar, Skeleton } from "@rafty/ui";
import { useAuth } from "../../../providers";
import { AccountPageCard } from "../Card";
import { EditNameDialog } from "./EditNameDialog";

export function BasicInfoCard() {
  const { user, profile, isProfileLoading, isProfileError } = useAuth();

  const profileName = [profile?.first_name, profile?.last_name]
    .join(" ")
    .trim();
  const displayName = user?.displayName ?? profileName;

  const isLoading = !user || !profile || isProfileLoading;

  return (
    <AccountPageCard title="Basic info">
      <p className="text-sm text-secondary-500 dark:text-secondary-300">
        Some info may be visible to other people using rhinobase.
      </p>
      <div className="grid grid-cols-4 items-center justify-items-start">
        <p className="font-medium">Photo</p>
        <div className="col-span-3 flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="size-9 min-h-9 min-w-9 rounded-full" />
          ) : isProfileError ? (
            <p className="text-sm text-red-500 dark:text-red-300">
              Error fetching data
            </p>
          ) : (
            <Avatar src={user?.photoURL ?? undefined} name={displayName} />
          )}
          {!isProfileError && (
            <p className="text-sm text-secondary-500 dark:text-secondary-300">
              A photo helps personalize your account
            </p>
          )}
        </div>
      </div>
      <div className="grid w-full grid-cols-4 items-center">
        <p className="font-medium">Name</p>
        <div className="col-span-3 flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="w-40 h-[30px] rounded-md" />
          ) : isProfileError ? (
            <p className="text-sm text-red-500 dark:text-red-300">
              Error fetching data
            </p>
          ) : (
            <>
              <p>{displayName}</p>
              <EditNameDialog />
            </>
          )}
        </div>
      </div>
    </AccountPageCard>
  );
}
