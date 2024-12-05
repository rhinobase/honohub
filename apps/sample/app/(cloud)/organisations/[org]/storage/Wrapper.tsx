"use client";
import { StoragePreferenceProvider, useUploadContext } from "@honohub/shared";
import { classNames, useBoolean } from "@rafty/ui";
import { nanoid } from "nanoid";
import type { PropsWithChildren } from "react";

export default function StorageWrapper(props: PropsWithChildren) {
  const [isFilesEntered, setFilesEntered] = useBoolean();
  const { setUploadedFiles } = useUploadContext();

  return (
    <StoragePreferenceProvider>
      <div
        className="relative flex flex-col gap-[inherit]"
        onDragEnterCapture={() => {
          setFilesEntered(true);
        }}
        onDropCapture={() => {
          setFilesEntered(false);
        }}
      >
        <input
          title=""
          type="file"
          multiple
          onChange={(event) => {
            setUploadedFiles((prev) => ({
              ...prev,
              ...Object.fromEntries(
                Array.from(event.target.files ?? []).map((file) => [
                  nanoid(),
                  {
                    file,
                    uploaded: false,
                  },
                ]),
              ),
            }));
            setFilesEntered(false);
          }}
          className={classNames(
            !isFilesEntered && "hidden",
            "absolute inset-0 z-[100] opacity-0",
          )}
        />
        {props.children}
      </div>
    </StoragePreferenceProvider>
  );
}
