import type { StorageDataType } from "../../types";

export function VideoDisplay(props: StorageDataType) {
  return (
    <div className="aspect-video h-full">
      <video muted controls>
        <source
          src={getCloudinaryURL(props)}
          type={`${props.resource_type}/${props.format}`}
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
