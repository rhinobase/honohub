export type AdminConfig = Partial<SanitizedAdmin> & {
  serverURL: string;
};

export type SanitizedAdmin = {
  serverURL: string;
  meta: {
    titleSuffix?: string;
    ogImage?: string;
    favicon?: string;
  };
  dateFormat?: string;
  routes: {
    page: string;
    import: string | { module: string; component: string };
  }[];
  plugins: AdminPlugin[];
};

export type AdminPlugin = {
  name: string;
  config?: (config: SanitizedAdmin) => SanitizedAdmin | undefined;
};
