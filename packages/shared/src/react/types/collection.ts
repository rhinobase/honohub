export type PreviewType = {
  domain: string;
  path: string;
  type: 0 | 1;
};

export type CollectionPreviewType = {
  create: PreviewType;
  view: PreviewType;
  update: PreviewType;
  list: PreviewType;
};

export type CollectionType = {
  _id: string;
  name: { singular: string; plural: string };
  slug: string;
  icon: string;
  preview?: Partial<CollectionPreviewType>;
};

export type TableResponseType = {
  results: Record<string, unknown>[];
  count: number;
};

export type CollectionsGroupType = {
  name: string;
  icon: string;
  collections: { _ref: string; _type: string }[];
};
