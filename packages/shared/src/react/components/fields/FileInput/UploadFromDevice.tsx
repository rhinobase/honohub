import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { eventHandler } from "@rafty/ui";
import { nanoid } from "nanoid";
import { useUploadContext } from "../../../../storage";
import { UploadFromCard } from "./UploadFromCard";

export type UploadFromDevice = {
  handleDialogClose: () => void;
};

export function UploadFromDevice({ handleDialogClose }: UploadFromDevice) {
  const { setUploadedFiles } = useUploadContext();

  const handleUpload = eventHandler(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      setUploadedFiles((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Array.from(input.files ?? []).map((file) => [
            nanoid(),
            {
              file,
              uploaded: false,
            },
          ]),
        ),
      }));
      handleDialogClose();
    };
    input.click();
  });

  return (
    <UploadFromCard
      title="Device"
      description="Choose file from this device."
      icon={ComputerDesktopIcon}
      onClick={handleUpload}
      onKeyDown={handleUpload}
    />
  );
}
