import { useStorage } from "../../providers";
import type { StorageDataType } from "../../types";

export function VideoDisplay(props: StorageDataType) {
  const { generateURL } = useStorage();

  return (
    <div className="aspect-video h-full">
      <video muted controls>
        <source
          src={generateURL({ content: props })}
          type={`${props.resource_type}/${props.format}`}
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
