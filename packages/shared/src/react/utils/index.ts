import axios from "axios";
import type { StorageDataType } from "../../storage";

export * from "./getActionPerformed";
export * from "./handle-error";
export * from "./schema-builder";

export const COOKIE_TOKEN_KEY = "ruid";

// API Server Endpoint
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.rhinobase.io/api"
    : "http://localhost:3004/api";

export const endpoint = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer,
});

function paramsSerializer(params: Record<string, unknown>) {
  return Object.entries(params)
    .reduce<string[]>((prev, [key, value]) => {
      if (value) {
        if (Array.isArray(value))
          prev.push(...value.map((val) => `${key}=${val}`));
        else if (typeof value === "object")
          prev.push(
            ...Object.entries(value).map(
              ([_key, _value]) => `${_key}=${_value}`,
            ),
          );
        else prev.push(`${key}=${value}`);
      }

      return prev;
    }, [])
    .join("&");
}

const CLOUDINARY_DOMAIN = "res.cloudinary.com";
const RHINOBASE_CLOUD_NAME = "rhinobase";
export function getCloudinaryURL(
  props: StorageDataType,
  options?: { filters?: string[]; raw?: boolean },
) {
  let params = "";

  const {
    filters = ["w_50", "c_fill", "ar_1:1", "g_auto", "r_max"],
    raw = false,
  } = options ?? {};

  if (filters.length > 0) params = `${filters.join(",")}/`;

  return `https://${CLOUDINARY_DOMAIN}/${RHINOBASE_CLOUD_NAME}/${
    props.resource_type
  }/${props.type}/${params}v${props.version ?? 1}/${props.public_id}${
    !raw ? ".jpg" : ""
  }`;
}

export enum CollectionPermission {
  LIST = "list",
  VIEW = "view",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum SortOrder {
  DESC = "-1",
  ASC = "1",
}

export enum StaticCollection {
  ROLES = "roles",
  TOKENS = "tokens",
  USERS = "users",
  WEBHOOKS = "webhooks",
  COLLECTIONS = "collections",
  GROUPS = "groups",
  CONTAINERS = "containers",
  REPORTS = "reports",
  TRASH = "trash",
}
