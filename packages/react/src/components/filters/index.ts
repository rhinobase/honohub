import { BooleanFilter } from "./BooleanFilter";
import { ReferenceFilter } from "./ReferenceFilter";
import { SelectFilter } from "./SelectFilter";

export { BooleanFilter } from "./BooleanFilter";
export { FiltersPanel } from "./FiltersPanel";
export { FiltersPanelToggleButton } from "./FiltersPanelToggleButton";
export { ReferenceFilter } from "./ReferenceFilter";
export { SelectFilter } from "./SelectFilter";

export const FILTER_COMPONENTS = {
  boolean: BooleanFilter,
  select: SelectFilter,
  reference: ReferenceFilter,
};
