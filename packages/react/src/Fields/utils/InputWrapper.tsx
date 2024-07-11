"use client";
import type { InputWrapperProps } from "@dawncms/core";
import { useThread } from "@fibr/react";
import RaftyIcon from "@rafty/icons";
import { InputGroup, LeftAddon, Prefix, RightAddon, Suffix } from "@rafty/ui";
import { cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const addonTextClasses = cva(
  "text-secondary-600 dark:text-secondary-400 font-medium",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
  },
);

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
        <LeftAddon className={addonTextClasses({ size })}>{prefix}</LeftAddon>
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
        <RightAddon className={addonTextClasses({ size })}>{suffix}</RightAddon>
      )}
    </InputGroup>
  );
}
