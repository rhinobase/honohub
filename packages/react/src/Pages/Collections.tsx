import { classNames } from "@rafty/ui";
import Link from "next/link";
import { type HTMLAttributes, forwardRef } from "react";
import { PageTitle } from "../Components";

const COLLECTIONS = [
  {
    label: "Sample",
    href: "/collection/sample",
  },
];

export function CollectionsPage() {
  return (
    <>
      <PageTitle>Collections</PageTitle>
      <div className="grid grid-cols-4 gap-4">
        {COLLECTIONS.map(({ label, href }, index) => (
          <Link
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            href={href}
          >
            <CollectionCard>
              <p className="text-lg font-medium text-secondary-600 leading-none">
                {label}
              </p>
            </CollectionCard>
          </Link>
        ))}
      </div>
    </>
  );
}

export type CollectionCard = HTMLAttributes<HTMLDivElement>;

export const CollectionCard = forwardRef<HTMLDivElement, CollectionCard>(
  function CollectionCard({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        className={classNames(
          "w-full h-20 flex items-center px-7 border border-secondary-300 rounded-md transition-all ease-in-out hover:shadow-lg",
          className,
        )}
        ref={forwardedRef}
      />
    );
  },
);
