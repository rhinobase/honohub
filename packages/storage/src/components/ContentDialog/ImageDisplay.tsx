import type { StorageDataType } from "../../types";

export function ImageDisplay(props: StorageDataType) {
  const args = [];
  if (props.width && props.width > 1080) args.push("w_1080");

  return (
    <img
      src={getCloudinaryURL(props, { filters: args })}
      alt={props.public_id}
      className="h-full object-contain"
    />
  );
}
