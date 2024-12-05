import { BooleanFilter, FiltersPanel } from "@honohub/shared";
import { Button, eventHandler } from "@rafty/ui";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { RolesFilter } from "./RolesFilter";

export function UserFiltersPanel() {
  const [queryParams, setQueryParams] = useQueryStates({
    role: parseAsArrayOf(parseAsString),
    superuser: parseAsBoolean,
    staff: parseAsBoolean,
    disabled: parseAsBoolean,
  });

  const handleClearAllFilters = eventHandler(() => setQueryParams(null));

  const showClearAllButton =
    queryParams.superuser ||
    queryParams.staff ||
    queryParams.disabled ||
    (queryParams.role && queryParams.role.length > 0);

  return (
    <FiltersPanel
      clearAllButton={
        showClearAllButton && (
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
      <BooleanFilter
        name="superuser"
        label={{ singular: "Superuser", plural: "Superusers" }}
      />
      <BooleanFilter
        name="staff"
        label={{ singular: "Staff User", plural: "Staff Users" }}
      />
      <BooleanFilter
        name="disabled"
        label={{ singular: "Disabled User", plural: "Disabled Users" }}
      />
      <RolesFilter />
    </FiltersPanel>
  );
}
