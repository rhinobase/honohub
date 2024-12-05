import { eventHandler } from "@rafty/ui";
import { forwardRef } from "react";
import {
  StorageLayout,
  useStorageActions,
  useStoragePreference,
} from "../../providers";
import type { StorageDataType } from "../../types";
import { GridCard } from "./GridCard";
import { ListCard } from "./ListCard";

export type StorageItem = StorageDataType;

export const StorageItem = forwardRef<HTMLDivElement, StorageItem>(
  function StorageItem(props, forwardedRef) {
    const value = useStoragePreference((state) => state.value);
    const { view } = useStorageActions();

    const handleDialogOpen = eventHandler(() => {
      view.set(props.public_id);
    });

    let resourceName = props.public_id.split("/").pop() ?? "";

    if (props.format) resourceName += `.${props.format}`;

    if (value === StorageLayout.LIST)
      return (
        <ListCard
          {...props}
          name={resourceName}
          handleDialogOpen={handleDialogOpen}
          ref={forwardedRef}
        />
      );
    return (
      <GridCard
        {...props}
        name={resourceName}
        handleDialogOpen={handleDialogOpen}
        ref={forwardedRef}
      />
    );
  },
);
