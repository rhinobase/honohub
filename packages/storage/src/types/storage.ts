export type StorageDataType = {
  _id: string;
  asset_id: string;
  public_id: string;
  format?: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  created_by?: {
    email: string;
    displayName: string;
  };
  bytes: number;
  width?: number;
  height?: number;
  private?: boolean;
  pages?: number;
};

export enum StorageLayout {
  GRID = "G",
  LIST = "L",
}
