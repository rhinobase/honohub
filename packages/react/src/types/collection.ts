export type CollectionType = {
  slug: string;
  label: string;
  columns: { name: string; label: string; type: string }[];
  fields: { name: string; label: string; type: string }[];
};
