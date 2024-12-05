"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@honohub/shared";
import { Skeleton } from "@rafty/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "We could not find the page you were looking for.",
};

export default function NotFoundPage() {
  return (
    <div className="h-[calc(100vh-96px)] w-full max-w-3xl px-3 md:mx-auto md:px-0">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <QuestionMarkCircleIcon className="size-24" />
        <div className="text-xl font-medium text-red-500 dark:text-red-300">
          404 ERROR
        </div>
        <div className="text-center text-3xl font-bold">
          We could not find the page you were looking for.
        </div>
        <div className="text-center text-xl font-medium text-secondary-500 dark:text-secondary-400">
          You may have mistyped the address or the page was moved or deleted.
          You can search for more results or head to our <RedirectLink />.
        </div>
      </div>
    </div>
  );
}

function RedirectLink() {
  const { user, isReady } = useAuth();

  if (!isReady) return <Skeleton className="w-[102px] h-[21px] inline-flex" />;

  if (user !== null)
    return (
      <Link
        href="/"
        className="text-primary-500 dark:text-primary-300 hover:underline"
      >
        homepage
      </Link>
    );
  return (
    <Link
      href="/signin"
      className="text-primary-500 dark:text-primary-300 hover:underline"
    >
      signin page
    </Link>
  );
}
