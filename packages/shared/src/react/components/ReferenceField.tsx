"use client";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  Combobox,
  ComboboxClearButton,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  useComboboxContext,
} from "@rafty/corp";
import { Avatar, useLastElement } from "@rafty/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { forwardRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useAuth } from "../providers";
import type { PaginatedResponse } from "../types";
import { endpoint } from "../utils";

const PAGE_SIZE = 10;

export type ReferenceFieldComponent = {
  id: string;
  to: {
    collection: string;
    organisation?: string;
  };
  initialValue?: string | (() => string);
  options?: {
    filter:
      | any
      | ((params: {
          document: object;
          parent?: object;
          value: any;
          currentUser: object;
        }) => any);
    filterParams?: Record<string, unknown>;
  };
  legacyOnChange?: (
    value: unknown,
    form: unknown,
    user: Record<string, unknown>,
    endpoint: AxiosInstance,
  ) => void;
} & Pick<Combobox, "isDisabled" | "isInvalid" | "isLoading" | "isReadOnly">;

enum CategoryType {
  MANAGE = "manage",
  DEV = "dev",
  COLLECTION = "collections",
}

const CATEGORY = {
  users: CategoryType.MANAGE,
  roles: CategoryType.MANAGE,
  webhooks: CategoryType.DEV,
  tokens: CategoryType.DEV,
  collections: CategoryType.DEV,
  containers: CategoryType.DEV,
};

export function ReferenceFieldComponent({
  id,
  isDisabled,
  isInvalid,
  isLoading,
  isReadOnly,
  ...props
}: ReferenceFieldComponent) {
  const { user } = useAuth();
  const { org } = useParams();
  const methods = useFormContext();
  const { control } = methods;
  const [search, setSearch] = useState<string>();

  const organisationId = props.to.organisation ?? org;
  const slug =
    CATEGORY[props.to.collection as keyof typeof CATEGORY] ??
    CategoryType.COLLECTION;

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["organisations", org, slug, props.to.collection, search],
    queryFn: async ({ pageParam = 0, signal }) =>
      endpoint
        .get<PaginatedResponse<ReferenceFieldItem>>(
          `/organisations/${organisationId}/${slug}/${props.to.collection}/reference`,
          {
            signal,
            params: {
              limit: PAGE_SIZE,
              offset: pageParam * PAGE_SIZE,
              search,
              ...props.options?.filterParams,
            },
          },
        )
        .then((res) => res.data),
    getNextPageParam: (lastPage, pages) => {
      const count = pages.flatMap((page) => page.results).length;
      if (lastPage.count <= count) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
  });

  const lastElementRef = useLastElement({
    isFetching,
    hasNextPage,
    fetchNextPage,
  });

  const items = data?.pages.flatMap((item) => item.results) ?? [];

  const options = items.map(({ _ref, title }) => ({
    label: title,
    value: _ref,
  }));

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={props.initialValue}
      render={({ field: { name, onChange, value, disabled } }) => (
        <Combobox
          id={name}
          type="single"
          options={options}
          selected={value?._ref}
          onSelectionChange={(value) => {
            if (value) {
              props.legacyOnChange?.(
                { _ref: value },
                methods,
                // @ts-expect-error: Legacy Code
                user,
                () => endpoint,
              );
              onChange({
                _ref: value,
                title: options?.find((item) => item.value === value)?.label,
              });
            } else onChange(null);
          }}
          placeholder={{
            trigger: "Select an option",
          }}
          isDisabled={isDisabled ?? disabled}
          isInvalid={isInvalid}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
        >
          <ComboboxTrigger>{value?.title}</ComboboxTrigger>
          <div className="mt-2 flex flex-row-reverse empty:hidden">
            <ComboboxClearButton />
          </div>
          <ComboboxContent
            isLoading={isFetching}
            search={search}
            onSearchChange={setSearch}
            showArrow={false}
            shouldFilter={false}
          >
            {({ option: { value }, index }) => {
              const isLastElement = options
                ? options.length - 1 === index
                : false;

              const fieldData = items.find(({ _ref }) => _ref === value);

              if (!fieldData) return null;

              return (
                <ReferenceFieldItem
                  {...fieldData}
                  key={index}
                  ref={isLastElement ? lastElementRef : undefined}
                />
              );
            }}
          </ComboboxContent>
        </Combobox>
      )}
    />
  );
}

type ReferenceFieldItem = {
  _ref: string;
  _type: string;
  title: string;
  text?: string;
  extra?: string[];
};

const ReferenceFieldItem = forwardRef<HTMLDivElement, ReferenceFieldItem>(
  function ReferenceFieldItem(props, forwardedRef) {
    const { selected, onSelectionChange } = useComboboxContext();

    // Checking if the current value is selected
    const isSelected =
      selected.findIndex((value) => value === props._ref) !== -1;

    const subHeading = [props.text, ...(props.extra ?? [])].reduce<unknown[]>(
      (prev, cur) => {
        if (!cur) return prev;

        const date = new Date(String(cur));
        if (!(date instanceof Date && !Number.isNaN(date)))
          prev.push(dayjs(date).format("yyyy-mm-dd"));
        else if (Array.isArray(cur)) prev.push(cur[cur.length - 1]);
        else prev.push(cur);

        return prev;
      },
      [],
    );

    return (
      <ComboboxItem
        value={props._ref}
        onSelect={onSelectionChange}
        ref={forwardedRef}
      >
        <div className="flex w-full items-center gap-2 text-start">
          <Avatar size="sm" name={props.title} />
          <div>
            <p>{props.title}</p>
            {subHeading.length > 0 && (
              <p className="max-w-[250px] truncate text-sm leading-tight text-secondary-500 dark:text-secondary-400 xl:max-w-none">
                {subHeading.join(" | ")}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1" />
        {isSelected && (
          <CheckIcon
            width={16}
            height={16}
            className="stroke-primary-500 dark:stroke-primary-300 min-h-4 min-w-4 stroke-2"
          />
        )}
      </ComboboxItem>
    );
  },
);
