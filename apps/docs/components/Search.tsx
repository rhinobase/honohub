"use client";
import {
  type AutocompleteApi,
  type AutocompleteCollection,
  type AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogContent,
  DialogOverlay,
  InputField,
  Kbd,
  classNames,
} from "@rafty/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  type SVGProps,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";
import type { Result } from "../mdx/search.mjs";
import { NAVIGATION } from "./Navigation";
import { useSearchDialog } from "./store";

type EmptyObject = Record<string, never>;

type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>;

type useAutocomplete = { close: () => void };

function useAutocomplete({ close }: useAutocomplete) {
  const id = useId();
  const router = useRouter();
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result> | EmptyObject
  >({});

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) {
      return;
    }

    router.push(itemUrl);

    if (
      itemUrl ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close();
    }
  }

  const [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: "Find something...",
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      navigator: {
        navigate,
      },
      getSources({ query }) {
        return import("../mdx/search.mjs").then(({ search }) => {
          return [
            {
              sourceId: "documentation",
              getItems() {
                return search(query, { limit: 5 });
              },
              getItemUrl({ item }) {
                return item.url;
              },
              onSelect: navigate,
            },
          ];
        });
      },
    }),
  );

  return { autocomplete, autocompleteState };
}

type IconType = SVGProps<SVGSVGElement>;

function NoResultsIcon(props: IconType) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  );
}

function LoadingIcon(props: IconType) {
  const id = useId();

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type HighlightQuery = { text: string; query: string };

function HighlightQuery({ text, query }: HighlightQuery) {
  return (
    <Highlighter
      highlightClassName="underline bg-transparent text-primary-500"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}

type SearchResult = {
  result: Result;
  resultIndex: number;
  autocomplete: Autocomplete;
  collection: AutocompleteCollection<Result>;
  query: string;
};

function SearchResult({
  result,
  resultIndex,
  autocomplete,
  collection,
  query,
}: SearchResult) {
  const id = useId();

  const sectionTitle = NAVIGATION.find(({ links }) =>
    links.find((link) => link.href === result.url.split("#")[0]),
  )?.title;
  const hierarchy = [sectionTitle, result.pageTitle].filter(
    (x): x is string => typeof x === "string",
  );

  return (
    <li
      className={classNames(
        "aria-selected:bg-secondary-50 dark:aria-selected:bg-secondary-800/50 group block cursor-default px-4 py-3",
        resultIndex > 0 &&
          "border-secondary-100 dark:border-secondary-800 border-t",
      )}
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className="text-secondary-900 group-aria-selected:text-primary-500 text-[0.875rem] font-medium leading-[1.5rem] dark:text-white"
      >
        <HighlightQuery text={result.title} query={query} />
      </div>
      {hierarchy.length > 0 && (
        <div
          id={`${id}-hierarchy`}
          aria-hidden="true"
          className="text-secondary-500 mt-1 truncate whitespace-nowrap text-[0.75rem] leading-[1.25rem]"
        >
          {hierarchy.map((item, index, items) => (
            <Fragment key={item}>
              <HighlightQuery text={item} query={query} />
              <span
                className={
                  index === items.length - 1
                    ? "sr-only"
                    : "text-secondary-300 dark:text-secondary-700 mx-2"
                }
              >
                /
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

type SearchResults = {
  autocomplete: Autocomplete;
  query: string;
  collection: AutocompleteCollection<Result>;
};

function SearchResults({ autocomplete, query, collection }: SearchResults) {
  if (collection.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <NoResultsIcon className="stroke-secondary-900 dark:stroke-secondary-600 mx-auto size-5" />
        <p className="text-secondary-700 dark:text-secondary-400 mt-2 text-[0.8125rem] leading-[1.5rem]">
          Nothing found for{" "}
          <strong className="text-secondary-900 break-words font-semibold dark:text-white">
            &lsquo;{query}&rsquo;
          </strong>
          . Please try again.
        </p>
      </div>
    );
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result, resultIndex) => (
        <SearchResult
          key={result.url}
          result={result}
          resultIndex={resultIndex}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  );
}

type SearchInput = {
  autocomplete: Autocomplete;
  autocompleteState: AutocompleteState<Result> | EmptyObject;
  onClose: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInput>(
  ({ autocomplete, autocompleteState, onClose }, forwardedRef) => {
    const inputProps = autocomplete.getInputProps({ inputElement: null });

    return (
      <div className="group relative flex h-12">
        <MagnifyingGlassIcon
          className="absolute left-2 top-4 stroke-2"
          height={16}
          width={16}
        />
        <InputField
          ref={forwardedRef}
          {...inputProps}
          className="pl-8"
          onKeyDown={(event) => {
            if (
              event.key === "Escape" &&
              !autocompleteState.isOpen &&
              autocompleteState.query === ""
            ) {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }

              onClose();
            } else {
              inputProps.onKeyDown(event);
            }
          }}
        />
        {autocompleteState.status === "stalled" && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <LoadingIcon className="stroke-secondary-200 text-secondary-900 dark:stroke-secondary-800 dark:text-primary-400 size-5 animate-spin" />
          </div>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export function SearchDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isOpen, setOpen } = useSearchDialog();

  const { autocomplete, autocompleteState } = useAutocomplete({
    close() {
      setOpen(false);
    },
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need this to update state on page change
  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams, setOpen]);

  useEffect(() => {
    if (!isOpen) {
      const keyDownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === "q") {
          setOpen(true);
        }
      };

      window.addEventListener("keydown", keyDownHandler);
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [isOpen, setOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogOverlay />
      <DialogContent
        showCloseButton={false}
        className="dark:bg-secondary-900 top-[15%] max-w-[370px] -translate-y-0 p-0 lg:max-w-[40rem]"
      >
        <div {...autocomplete.getRootProps({})}>
          <form
            ref={formRef}
            {...autocomplete.getFormProps({
              inputElement: inputRef.current,
            })}
          >
            <SearchInput
              ref={inputRef}
              autocomplete={autocomplete}
              autocompleteState={autocompleteState}
              onClose={() => setOpen(false)}
            />
            <div
              ref={panelRef}
              className="px-2 py-3 empty:hidden"
              {...autocomplete.getPanelProps({})}
            >
              {autocompleteState.isOpen && (
                <SearchResults
                  autocomplete={autocomplete}
                  query={autocompleteState.query}
                  collection={autocompleteState.collections[0]}
                />
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Search() {
  const [modifierKey, setModifierKey] = useState<string>();
  const setOpen = useSearchDialog((state) => state.setOpen);

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl ",
    );
  }, []);

  return (
    <div className="hidden lg:block lg:max-w-md lg:flex-auto">
      <Button
        type="button"
        className="w-[470px] gap-2 rounded-full py-1"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon height={16} width={16} className="stroke-2" />
        Find something...
        <div className="flex-1" />
        <div>
          <Kbd>{modifierKey} + K</Kbd>
        </div>
      </Button>
    </div>
  );
}

export function MobileSearch() {
  const setOpen = useSearchDialog((state) => state.setOpen);

  return (
    <div className="contents lg:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Find something..."
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon height={16} width={16} className="stroke-2" />
      </Button>
    </div>
  );
}
