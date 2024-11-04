export type PaginatedResponse<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  results: T[];
  count: number;
};
