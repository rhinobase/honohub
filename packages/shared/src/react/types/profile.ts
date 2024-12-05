import type { CollectionPermission } from "../utils";

export type Profile = {
  uid: string;
  email: string;
  phone: string;
  picture: string;
  superuser: boolean;
  staff: boolean;
  dev: boolean;
  first_name: string;
  last_name: string;
  preferences?: {
    organisation?: string;
  };
  permissions?: Record<string, Partial<Record<CollectionPermission, boolean>>>;
};
