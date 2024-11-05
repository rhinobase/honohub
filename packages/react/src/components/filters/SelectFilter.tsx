import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  eventHandler,
} from "@rafty/ui";
import { useField } from "duck-form";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export type SelectFilter = {
  name: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
};

export function SelectFilter() {
  const props = useField<SelectFilter>();
  const [query, setQuery] = useQueryState(
    props.name,
    parseAsArrayOf(parseAsString),
  );
  const handleClearFilter = eventHandler(() => setQuery(null));

  return (
    <AccordionItem value={props.name} className="flex flex-col">
      <AccordionTrigger
        className="bg-transparent dark:bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-900 data-[state=open]:bg-secondary-100 dark:data-[state=open]:bg-secondary-900 py-2 flex-none data-[state=open]:text-black dark:data-[state=open]:text-white justify-start gap-2 capitalize"
        showIcon={false}
      >
        <ChevronDownIcon className="stroke-secondary-600 group-data-[state=open]:stroke-black dark:stroke-secondary-400 dark:group-data-[state=open]:stroke-white shrink-0 -rotate-90 stroke-[2.5] transition-transform duration-200 group-data-[state=open]:rotate-0 size-3.5" />
        {props.label}
        {query && query.length > 0 && (
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
        <div className="w-full max-h-[250px] p-1 overflow-y-auto">
          {props.options.map((item) => {
            const handleInteract = eventHandler(() =>
              setQuery((values) => {
                const tmp = values ? [...values] : [];

                const index = tmp.findIndex((value) => value === item.value);

                if (index > -1) tmp.splice(index, 1);
                else tmp.push(item.value);

                if (tmp.length === 0) return null;

                return tmp;
              }),
            );

            return (
              <div
                key={item.value}
                className="px-2.5 py-1.5 hover:dark:bg-secondary-800 rounded-sm cursor-pointer transition-all hover:bg-secondary-100 flex justify-between items-center"
                onClick={handleInteract}
                onKeyDown={handleInteract}
              >
                <p className="text-xs">{item.label}</p>
                {query?.includes(item.value) && (
                  <CheckIcon className="size-3.5 stroke-2 stroke-primary-500 dark:stroke-primary-300" />
                )}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
