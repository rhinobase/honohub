import type { StorageDataType } from "../types";

export function getStorageItemIcon(props: StorageDataType) {
  switch (props.format) {
    case "pdf":
      return "picture_as_pdf";
    default:
      break;
  }
  switch (props.resource_type) {
    case "image":
      return "image";
    case "video":
      return "play_circle_outline";
    default:
      return "description";
  }
}
