import { eventHandler } from "@rafty/ui";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export function useFilter(name: string) {
  const [query, setQueryParam] = useQueryState(
    name,
    parseAsArrayOf(parseAsString),
  );

  const clear = eventHandler(() => setQueryParam(null));

  const setQuery = (id: string) =>
    eventHandler(() =>
      setQueryParam((values) => {
        const tmp = values ? [...values] : [];

        const index = tmp.findIndex((value) => value === id);

        if (index > -1) tmp.splice(index, 1);
        else tmp.push(id);

        if (tmp.length === 0) return null;

        return tmp;
      }),
    );

  return { query, clear, setQuery };
}
