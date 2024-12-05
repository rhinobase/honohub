import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  RadioGroup,
  RadioGroupItem,
  eventHandler,
} from "@rafty/ui";
import { parseAsBoolean, useQueryState } from "nuqs";

export type BooleanFilter = {
  name: string;
  label: {
    singular: string;
    plural: string;
  };
};

export function BooleanFilter(props: BooleanFilter) {
  const [queryParam, setQueryParam] = useQueryState(props.name, parseAsBoolean);

  const handleClearFilter = eventHandler(() => setQueryParam(null));

  return (
    <AccordionItem value={props.name} className="flex flex-col">
      <AccordionTrigger
        className="bg-transparent dark:bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-900 data-[state=open]:bg-secondary-100 dark:data-[state=open]:bg-secondary-900 py-2 flex-none data-[state=open]:text-black dark:data-[state=open]:text-white justify-start gap-2 capitalize"
        showIcon={false}
      >
        <ChevronDownIcon className="stroke-secondary-600 group-data-[state=open]:stroke-black dark:stroke-secondary-400 dark:group-data-[state=open]:stroke-white shrink-0 -rotate-90 stroke-[2.5] transition-transform duration-200 group-data-[state=open]:rotate-0 size-3.5" />
        {props.label.plural}
        {queryParam && (
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
        <div className="h-full px-2 py-1.5">
          <RadioGroup
            value={queryParam !== null ? String(Number(queryParam)) : undefined}
            onValueChange={(val) => setQueryParam(Boolean(Number(val)))}
          >
            <RadioGroupItem id={`${props.name}.0`} value="1">
              True
            </RadioGroupItem>
            <RadioGroupItem id={`${props.name}.1`} value="0">
              False
            </RadioGroupItem>
          </RadioGroup>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
