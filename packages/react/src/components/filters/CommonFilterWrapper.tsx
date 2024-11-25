import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  classNames,
} from "@rafty/ui";
import { type HTMLAttributes, type PropsWithChildren, forwardRef } from "react";
import { useFilter } from "./useFilter";

export type CommonFilterWrapper = PropsWithChildren<{
  name: string;
  label: string;
}>;

export function CommonFilterWrapper({
  label,
  name,
  children,
}: CommonFilterWrapper) {
  const { query, clear } = useFilter(name);

  return (
    <AccordionItem value={name} className="flex flex-col">
      <AccordionTrigger
        className="bg-transparent dark:bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-900 data-[state=open]:bg-secondary-100 dark:data-[state=open]:bg-secondary-900 py-2 flex-none data-[state=open]:text-black dark:data-[state=open]:text-white justify-start gap-2 capitalize"
        showIcon={false}
      >
        <ChevronDownIcon className="stroke-secondary-600 group-data-[state=open]:stroke-black dark:stroke-secondary-400 dark:group-data-[state=open]:stroke-white shrink-0 -rotate-90 stroke-[2.5] transition-transform duration-200 group-data-[state=open]:rotate-0 size-3.5" />
        {label}
        {query && query.length > 0 && (
          <>
            <div className="flex-1" />
            <div
              className="p-0.5 rounded text-red-500 dark:text-red-300 hover:bg-red-200/40 dark:hover:bg-red-300/10 transition-all outline-none focus-visible:ring-2 ring-red-300 dark:ring-red-100 ring-offset-2 ring-offset-white dark:ring-offset-secondary-950"
              onClick={clear}
              onKeyDown={clear}
            >
              <XMarkIcon className="size-3.5 stroke-2" />
            </div>
          </>
        )}
      </AccordionTrigger>
      <AccordionContent className="h-full px-0">{children}</AccordionContent>
    </AccordionItem>
  );
}

export type FilterList = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  items: { label: string; value: string }[];
  name: string;
};

export const FilterList = forwardRef<HTMLDivElement, FilterList>(
  function FilterList({ items, className, ...props }, forwardedRef) {
    const { query, setQuery } = useFilter(props.name);

    return (
      <div
        {...props}
        className={classNames(
          "w-full max-h-[250px] overflow-y-auto",
          className,
        )}
      >
        {items.map((item) => (
          <div
            key={item.value}
            className="px-2.5 py-1.5 hover:dark:bg-secondary-800 rounded-sm cursor-pointer transition-all hover:bg-secondary-100 flex justify-between items-center"
            onClick={setQuery(item.value)}
            onKeyDown={setQuery(item.value)}
            ref={forwardedRef}
          >
            <p className="text-xs">{item.label}</p>
            {query?.includes(item.value) && (
              <CheckIcon className="size-3.5 stroke-2 stroke-primary-500 dark:stroke-primary-300" />
            )}
          </div>
        ))}
      </div>
    );
  },
);
