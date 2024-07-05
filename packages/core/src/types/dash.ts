export type DashConfig = Partial<SanitizedDash> & {
  serverURL: string;
};

export type SanitizedDash = {
  serverURL: string;
  meta: {
    titleSuffix?: string;
    ogImage?: string;
    favicon?: string;
  };
  dateFormat?: string;
  components?: Record<string, unknown>;
};
