import { BooleanFilter } from "./BooleanFilter";
import { ReferenceFilter } from "./ReferenceFilter";
import { SelectFilter } from "./SelectFilter";

export { FiltersPanel } from "./FiltersPanel";
export { FiltersPanelToggleButton } from "./FiltersPanelToggleButton";

export const FILTER_COMPONENTS = {
  boolean: BooleanFilter,
  select: SelectFilter,
  reference: ReferenceFilter,
};
