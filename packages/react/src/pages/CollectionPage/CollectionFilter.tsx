import { Button, eventHandler } from "@rafty/ui";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { type ParserBuilder, parseAsString, useQueryStates } from "nuqs";
import { FILTER_COMPONENTS, FiltersPanel } from "../../components/filters";

const FILTERS = [
  {
    name: "status",
    type: "boolean",
    label: "Status",
  },
  {
    name: "name",
    type: "select",
    label: "Name",
    options: [
      { label: "Sample", value: "A" },
      { label: "Demo", value: "B" },
      { label: "Demo1", value: "C" },
    ],
  },
];

export function CollectionFilter() {
  const defaultFilterQuery = FILTERS.reduce<
    Record<string, ParserBuilder<string>>
  >((prev, cur) => {
    prev[cur.name] = parseAsString;
    return prev;
  }, {});

  const [query, setQuery] = useQueryStates(defaultFilterQuery);

  const handleClearAllFilters = eventHandler(() => setQuery(null));

  const showClearButton =
    Object.values(query).filter((val) => val != null).length > 0;

  return (
    <DuckForm
      components={FILTER_COMPONENTS}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FiltersPanel
        clearAllButton={
          showClearButton && (
            <Button
              variant="ghost"
              size="sm"
              colorScheme="error"
              onClick={handleClearAllFilters}
              onKeyDown={handleClearAllFilters}
            >
              Clear all
            </Button>
          )
        }
      >
        <Blueprint>
          {FILTERS.map((items) => (
            <DuckField key={items.name} {...items} />
          ))}
        </Blueprint>
      </FiltersPanel>
    </DuckForm>
  );
}
