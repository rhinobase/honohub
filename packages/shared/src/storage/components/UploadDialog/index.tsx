import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Text, classNames, eventHandler } from "@rafty/ui";
import { useUploadContext } from "../../providers";
import { UploadFileItem } from "./UploadItem";

export function UploadDialog() {
  const {
    uploadedFiles,
    toggleCancel,
    setUploadedFiles,
    isMinimized,
    toggleMinimize,
  } = useUploadContext();

  const uploads = Object.values(uploadedFiles);

  if (uploads.length === 0) return;

  const remainingUploads = uploads.filter(({ uploaded }) => !uploaded).length;

  const isAllUploaded = uploads.every((item) => item.uploaded === true);

  const handleCancelUpload = eventHandler(() => {
    if (isAllUploaded) setUploadedFiles({});
    else toggleCancel(true);
  });

  const handleMinimize = eventHandler(() => toggleMinimize());

  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-800 max-h-[350px] w-[400px] bg-white dark:bg-secondary-900 shadow-2xl flex flex-col overflow-hidden fixed bottom-2 right-2">
      <div
        className={classNames(
          !isMinimized &&
            "border-b border-secondary-200 dark:border-secondary-800",
          "flex items-center pl-3.5 pr-2.5 py-2.5 gap-2 rounded-t-lg",
        )}
      >
        <Text>
          {remainingUploads === 0
            ? "Uploaded"
            : `Uploading ${remainingUploads}`}{" "}
          items
        </Text>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="fab"
          onClick={handleMinimize}
          onKeyDown={handleMinimize}
        >
          <ChevronDownIcon
            className={classNames(
              isMinimized ? "rotate-180" : "rotate-0",
              "size-4 stroke-[3]",
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="fab"
          onClick={handleCancelUpload}
          onKeyDown={handleCancelUpload}
        >
          <XMarkIcon className="size-4 stroke-[3]" />
        </Button>
      </div>
      <div
        className={classNames(
          isMinimized ? "hidden" : "flex",
          "flex-col overflow-y-auto",
        )}
      >
        {Object.keys(uploadedFiles).map((key) => (
          <UploadFileItem key={key} id={key} />
        ))}
      </div>
    </div>
  );
}
