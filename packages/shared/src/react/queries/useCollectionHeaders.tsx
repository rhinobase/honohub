"use client";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { classNames, eventHandler } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  type Values,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { DataTable } from "../components";
import type { HeaderType } from "../types";
import { SortOrder, endpoint } from "../utils";

const QUERY_VALIDATION = {
  limit: parseAsInteger,
  offset: parseAsInteger,
  search: parseAsString,
  orderBy: parseAsString,
  order: parseAsStringEnum(Object.values(SortOrder)),
};

const getCollectionHeadersQueryKey = (
  options: {
    org: string | string[];
    col: string | string[];
  } & Values<typeof QUERY_VALIDATION>,
) => {
  const key = [
    "organisations",
    options.org,
    "collections",
    options.col,
    "headers",
    options.limit,
    options.offset,
  ];

  if (options.search) key.push(options.search);
  if (options.order) key.push(options.order);
  if (options.orderBy) key.push(options.orderBy);

  return key;
};

export function useCollectionHeaders() {
  const [options, setQuery] = useQueryStates(QUERY_VALIDATION);

  const { org, col } = useParams();
  const queryKey = getCollectionHeadersQueryKey({ col, org, ...options });

  return useQuery<DataTable["headers"]>({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<HeaderType[]>(`organisations/${org}/collections/${col}/headers`, {
          signal,
        })
        .then((res) =>
          res.data.reduceRight<DataTable["headers"]>(
            (prev, cur) => {
              if (cur) {
                const { name, title, type, ...metadata } = cur;

                prev.unshift({
                  accessorKey: name,
                  header: () => {
                    const handleSort = eventHandler(() => {
                      const order = options.order
                        ? options.order === SortOrder.DESC
                          ? SortOrder.ASC
                          : undefined
                        : SortOrder.DESC;
                      const orderBy = order ? name : undefined;

                      setQuery({ ...options, orderBy, order });
                    });

                    return (
                      <div
                        className="cursor-pointer w-full flex items-center"
                        onClick={handleSort}
                        onKeyDown={handleSort}
                      >
                        <p className="w-full truncate">{title}</p>
                        {options.order && options.orderBy === name && (
                          <ArrowDownIcon
                            className={classNames(
                              options.order === SortOrder.ASC
                                ? "rotate-180"
                                : "rotate-0",
                              "size-3 stroke-[3]",
                            )}
                          />
                        )}
                      </div>
                    );
                  },
                  type: type ?? "string",
                  metadata,
                });
              }

              return prev;
            },
            [
              {
                id: "action",
                accessorKey: "_id",
                header: "Action",
                type: "__collection_action",
              },
            ],
          ),
        ),
    enabled: !!col,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
