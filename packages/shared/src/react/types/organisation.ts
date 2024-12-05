import type { StorageDataType } from "../../storage";

export type OrganizationType = {
  _id: string;
  name: string;
  slug: string;
  logo: StorageDataType;
  allocated: number;
  used: number;
  default: boolean;
  report: boolean;
};
