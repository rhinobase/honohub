import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Heading } from "./Heading";
import { Prose } from "./Prose";

export const a = Link;
export { CodeGroup, Code as code, Pre as pre } from "./Code";

export function wrapper({ children }: PropsWithChildren) {
  return (
    <article className="flex h-full flex-col pb-10 pt-16">
      <Prose className="flex-auto">{children}</Prose>
    </article>
  );
}

export const h2 = function H2(props: Omit<Heading<2>, "level">) {
  return <Heading level={2} {...props} />;
};

export function Note({ children }: PropsWithChildren) {
  return (
    <div className="bg-primary-50/50 border-primary-500/20 text-primary-900 dark:border-primary-500/30 dark:bg-primary-500/5 dark:text-primary-200 my-6 flex gap-2.5 rounded-2xl border p-4 leading-6 dark:[--tw-prose-links-hover:theme(colors.primary.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <div>
        <InformationCircleIcon width={20} height={20} className="stroke-2" />
      </div>
      <div className="leading-snug [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Row({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  );
}

export function Col({
  children,
  sticky = false,
}: PropsWithChildren<{
  sticky?: boolean;
}>) {
  return (
    <div
      className={classNames(
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        sticky && "xl:sticky xl:top-24",
      )}
    >
      {children}
    </div>
  );
}

export function Properties({ children }: PropsWithChildren) {
  return (
    <div className="my-6">
      <ul className="divide-secondary-900/5 m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y p-0 dark:divide-white/5">
        {children}
      </ul>
    </div>
  );
}

export function Property({
  name,
  children,
  type,
}: PropsWithChildren<{
  name: string;
  type?: string;
}>) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="text-secondary-400 dark:text-secondary-500 font-mono text-[0.8125rem] leading-[1.5rem]">
              {type}
            </dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  );
}
