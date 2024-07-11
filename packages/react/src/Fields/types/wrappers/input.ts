import type { RaftyIconProps } from "@rafty/icons";
import type { ReactNode } from "react";

export type InputWrapperProps = {
  size?: "sm" | "md" | "lg";
  prefix?: ReactNode;
  suffix?: ReactNode;
  prefixIcon?: RaftyIconProps["type"];
  suffixIcon?: RaftyIconProps["type"];
};
