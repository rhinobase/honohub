import { eventHandler } from "@rafty/ui";
import { forwardRef } from "react";
import { useStorageActions } from "../../providers";
import { type StorageDataType, StorageLayout } from "../../types";
import { GridCard } from "./GridCard";
import { ListCard } from "./ListCard";

export type StorageItem = StorageDataType;

export const StorageItem = forwardRef<HTMLDivElement, StorageItem>(
  function StorageItem(props, forwardedRef) {
    const {
      storage: { value },
    } = usePreference();
    const { view } = useStorageActions();

    const handleDialogOpen = eventHandler(() => {
      view.set(props.public_id);
    });

    let resourceName = props.public_id.split("/").pop() ?? "";

    if (props.format) resourceName += `.${props.format}`;

    if (value === StorageLayout.LIST)
      return (
        <ListCard
          name={resourceName}
          type={props.resource_type}
          publicId={props.public_id}
          isPrivate={props.private ?? false}
          handleDialogOpen={handleDialogOpen}
          ref={forwardedRef}
        />
      );
    return (
      <GridCard
        name={resourceName}
        type={props.resource_type}
        publicId={props.public_id}
        isPrivate={props.private ?? false}
        handleDialogOpen={handleDialogOpen}
        ref={forwardedRef}
      />
    );
  },
);
