import { Button, eventHandler } from "@rafty/ui";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  useQueryStates,
} from "nuqs";
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
  const [query, setQuery] = useQueryStates({
    status: parseAsBoolean,
    name: parseAsArrayOf(parseAsString),
  });

  const handleClearAllFilters = eventHandler(() =>
    setQuery({
      status: null,
      name: null,
    }),
  );

  return (
    <DuckForm
      components={FILTER_COMPONENTS}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FiltersPanel
        clearAllButton={
          (query.name || query.status) && (
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
