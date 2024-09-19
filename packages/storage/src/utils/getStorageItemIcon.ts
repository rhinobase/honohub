import {
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import type { StorageDataType } from "../types";

export function getStorageItemIcon(props: StorageDataType) {
  switch (props.format) {
    case "pdf":
      return DocumentTextIcon;
    default:
      break;
  }
  switch (props.resource_type) {
    case "image":
      return PhotoIcon;
    case "video":
      return PlayCircleIcon;
    default:
      return DocumentIcon;
  }
}
