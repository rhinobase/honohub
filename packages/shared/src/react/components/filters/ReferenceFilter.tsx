import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SearchbarComponent } from "@honohub/shared";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Spinner,
  eventHandler,
} from "@rafty/ui";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import type { ReferenceType } from "../../types";

export type ReferenceFilter = {
  name: string;
  label: {
    singular: string;
    plural: string;
  };
  data: ReferenceType[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  onSearchChange: (search?: string) => void;
  lastElementRef: (node: HTMLDivElement) => void;
};

export function ReferenceFilter(props: ReferenceFilter) {
  const [queryParam, setQueryParam] = useQueryState(
    props.name,
    parseAsArrayOf(parseAsString),
  );
  const handleClearFilter = eventHandler(() => setQueryParam(null));

  return (
    <AccordionItem value={props.name} className="flex flex-col">
      <AccordionTrigger
        className="bg-transparent dark:bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-900 data-[state=open]:bg-secondary-100 dark:data-[state=open]:bg-secondary-900 py-2 flex-none data-[state=open]:text-black dark:data-[state=open]:text-white justify-start gap-2 capitalize"
        showIcon={false}
      >
        <ChevronDownIcon className="stroke-secondary-600 group-data-[state=open]:stroke-black dark:stroke-secondary-400 dark:group-data-[state=open]:stroke-white shrink-0 -rotate-90 stroke-[2.5] transition-transform duration-200 group-data-[state=open]:rotate-0 size-3.5" />
        {props.label.plural}
        {queryParam && queryParam.length > 0 && (
          <>
            <div className="flex-1" />
            <div
              className="p-0.5 rounded text-red-500 dark:text-red-300 hover:bg-red-200/40 dark:hover:bg-red-300/10 transition-all outline-none focus-visible:ring-2 ring-red-300 dark:ring-red-100 ring-offset-2 ring-offset-white dark:ring-offset-secondary-950"
              onClick={handleClearFilter}
              onKeyDown={handleClearFilter}
            >
              <XMarkIcon className="size-3.5 stroke-2" />
            </div>
          </>
        )}
      </AccordionTrigger>
      <AccordionContent className="h-full px-0">
        <div className="h-full p-1">
          <SearchbarComponent
            size="sm"
            local
            onChange={props.onSearchChange}
            className="mb-1"
            placeholder={`Search ${props.label.singular.toLowerCase()}`}
          />
          {props.data ? (
            props.data.length > 0 ? (
              <div className="w-full max-h-[250px] overflow-y-auto">
                {props.data.map((item) => {
                  const handleInteract = eventHandler(() =>
                    setQueryParam((values) => {
                      const tmp = values ? [...values] : [];

                      const index = tmp.findIndex(
                        (value) => value === item._ref,
                      );

                      if (index > -1) tmp.splice(index, 1);
                      else tmp.push(item._ref);

                      if (tmp.length === 0) return null;

                      return tmp;
                    }),
                  );

                  return (
                    <div
                      key={item._ref}
                      className="px-2.5 py-1.5 hover:dark:bg-secondary-800 rounded-sm cursor-pointer transition-all hover:bg-secondary-100 flex justify-between items-center"
                      onClick={handleInteract}
                      onKeyDown={handleInteract}
                      ref={props.lastElementRef}
                    >
                      <p className="text-xs">{item.title}</p>
                      {queryParam?.includes(item._ref) && (
                        <CheckIcon className="size-3.5 stroke-2 stroke-primary-500 dark:stroke-primary-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-secondary-400 dark:text-secondary-600 py-1.5 text-center">
                No {props.label.singular.toLowerCase()} found
              </p>
            )
          ) : (
            props.isLoading && (
              <div className="flex items-center gap-1.5 w-full justify-center py-1.5">
                <Spinner size="sm" className="min-w-4 min-h-4 size-4" />
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Loading {props.label.plural.toLowerCase()} data...
                </p>
              </div>
            )
          )}
          {props.isFetching && !props.isLoading && (
            <div className="flex items-center gap-1.5 w-full justify-center py-1.5">
              <Spinner size="sm" className="min-w-4 min-h-4 size-4" />
              <p className="text-xs text-secondary-600 dark:text-secondary-400">
                Loading more data...
              </p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
