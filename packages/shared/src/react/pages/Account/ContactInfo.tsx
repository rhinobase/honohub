"use client";
import { Skeleton } from "@rafty/ui";
import { useAuth } from "../../providers";
import { AccountPageCard } from "./Card";

export function ContactInfoCard() {
  const { user } = useAuth();

  return (
    <AccountPageCard title="Contact info">
      <div className="grid w-full grid-cols-4 items-center">
        <p className="font-medium">Email</p>
        {user ? (
          <p className="col-span-3 w-full">{user.email}</p>
        ) : (
          <Skeleton className="w-40 h-6 rounded-md" />
        )}
      </div>
      <div className="grid w-full grid-cols-4 items-center">
        <p className="font-medium">Phone</p>
        {user ? (
          <p className="col-span-3 w-full">{user?.phoneNumber ?? "N/A"}</p>
        ) : (
          <Skeleton className="w-40 h-6 rounded-md" />
        )}
      </div>
    </AccountPageCard>
  );
}
