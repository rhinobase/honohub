import { Button, eventHandler, useQueryParams } from "@rafty/ui";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const { pathname } = useLocation();
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();

  const { setQueryParams } = useQueryParams({
    onChange: navigation,
    pathname,
    searchParams: searchParams.toString(),
  });

  const handleClearAllFilters = eventHandler(() =>
    setQueryParams({
      status: undefined,
      name: undefined,
    }),
  );

  const updateFilters = (type: string, id: string, arr?: string[]) => {
    if (id)
      if (arr) {
        const index = arr.findIndex((item) => item === id);

        if (index >= 0) arr.splice(index, 1);
        else arr.push(id);

        if (arr.length > 0) setQueryParams({ [type]: arr });
        else setQueryParams({ [type]: undefined });
      } else setQueryParams({ [type]: id });
    else setQueryParams({ [type]: undefined });
  };

  return (
    <DuckForm
      components={FILTER_COMPONENTS}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FiltersPanel
        clearAllButton={
          searchParams.size > 0 && (
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
          {Object.values(FILTERS).map((items) => {
            const isBoolean = items.type === "boolean";

            const arr = !isBoolean
              ? searchParams.get(items.name)?.split(",")
              : undefined;

            return (
              <DuckField
                key={items.name}
                {...items}
                filter={
                  isBoolean
                    ? searchParams.get(items.name)
                    : searchParams.get(items.name)?.split(",")
                }
                onChange={(val: string) => updateFilters(items.name, val, arr)}
              />
            );
          })}
        </Blueprint>
      </FiltersPanel>
    </DuckForm>
  );
}
