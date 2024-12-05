"use client";
import { Skeleton } from "@rafty/ui";
import { useAuth } from "../../../providers";
import { AccountPageCard } from "../Card";
import { EditPasswordDialog } from "./EditPasswordDialog";

export function PasswordInfoCard() {
  const { user, profile, isProfileLoading, isProfileError } = useAuth();
  const isLoading = !user || !profile || isProfileLoading;

  return (
    <AccountPageCard title="Password">
      <p className="text-sm text-secondary-500 dark:text-secondary-300">
        A secure password helps protect your Rhinobase Account
      </p>
      <div className="grid w-full grid-cols-4 items-center">
        <p className="font-medium">Password</p>
        <div className="col-span-3 flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="w-40 h-[30px] rounded-md" />
          ) : isProfileError ? (
            <p className="text-sm text-red-500 dark:text-red-300">
              Error fetching data
            </p>
          ) : (
            <>
              <p className="text-lg">••••••••</p>
              <EditPasswordDialog />
            </>
          )}
        </div>
      </div>
    </AccountPageCard>
  );
}
