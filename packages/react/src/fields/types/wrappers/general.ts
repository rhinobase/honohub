import type { FieldWrapperProps } from "./field";
import type { TooltipWrapperProps } from "./tooltip";

export type GeneralWrapperProps<T = undefined> = T &
  FieldWrapperProps &
  TooltipWrapperProps;
