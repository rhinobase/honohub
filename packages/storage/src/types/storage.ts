export type StorageDataType = {
  _id: string;
  _type?: string;
  _ref?: string;
  asset_id: string;
  public_id: string;
  version: number;
  type: string;
  created_at: string;
  created_by: {
    _ref: string;
    _type: "users";
    email?: string;
    displayName?: string;
  };
  bytes: number;
  private?: boolean;
  organisation: { _ref: string; _type: "organisations" };
} & (
  | ({
      resource_type: "image";
      width: number;
      height: number;
    } & ({ format: "png" | "jpg" } | { format: "pdf"; pages: number }))
  | {
      resource_type: "video";
      width: number;
      height: number;
      format: "mp4";
    }
  | {
      resource_type: "raw";
      width: null;
      height: null;
      format: null;
    }
);
