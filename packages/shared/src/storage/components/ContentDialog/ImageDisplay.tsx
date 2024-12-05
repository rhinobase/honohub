import { useStorage } from "../../providers";
import type { StorageDataType } from "../../types";

export function ImageDisplay(props: StorageDataType) {
  const { generateURL, imageRender: Img } = useStorage();

  const filters: Record<string, number> = {};
  if (props.width && props.width > 1080) filters.width = 1080;

  return (
    <Img
      src={generateURL({
        content: props,
        filters,
      })}
      alt={props.public_id}
      className="size-full object-contain"
      width={1000}
      height={1000}
    />
  );
}
