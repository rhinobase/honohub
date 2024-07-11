"use client";
import { useThread } from "@fibr/react";
import RaftyIcon from "@rafty/icons";
import {
  InputGroup,
  LeftAddon,
  Prefix,
  RightAddon,
  Suffix,
  classNames,
} from "@rafty/ui";
import type { PropsWithChildren } from "react";
import type { InputWrapperProps } from "../types";

const addonTextClasses = {
  size: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  },
};

export type InputWrapper = PropsWithChildren;

export function InputWrapper({ children }: InputWrapper) {
  const {
    prefixIcon,
    prefix,
    suffixIcon,
    size = "md",
    suffix,
  } = useThread<InputWrapperProps>();

  return (
    <InputGroup size={size} className="w-full">
      {prefix && (
        <LeftAddon
          className={classNames(
            addonTextClasses.size[size],
            "text-secondary-600 dark:text-secondary-400 font-medium",
          )}
        >
          {prefix}
        </LeftAddon>
      )}
      {prefixIcon && (
        <Prefix>
          <RaftyIcon type={prefixIcon} className="opacity-60 size-4" />
        </Prefix>
      )}
      {children}
      {suffixIcon && (
        <Suffix>
          <RaftyIcon type={suffixIcon} className="size-4" />
        </Suffix>
      )}
      {suffix && (
        <RightAddon
          className={classNames(
            addonTextClasses.size[size],
            "text-secondary-600 dark:text-secondary-400 font-medium",
          )}
        >
          {suffix}
        </RightAddon>
      )}
    </InputGroup>
  );
}
