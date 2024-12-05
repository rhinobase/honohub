export enum HistoryAction {
  CREATE = "C",
  UPDATE = "U",
  DELETE = "D",
  ACTION = "A",
}

export type History = (
  | {
      action:
        | HistoryAction.CREATE
        | HistoryAction.UPDATE
        | HistoryAction.DELETE;
      document: string;
    }
  | {
      action: HistoryAction.ACTION;
      name: string;
      document: string[];
    }
) & {
  collection: {
    name: string;
    slug: string;
    org?: {
      name: string;
      slug: string;
    };
  };
  date: string;
  created_by: {
    _ref: string;
    display: string;
    photo: string;
    email: string;
  };
};
