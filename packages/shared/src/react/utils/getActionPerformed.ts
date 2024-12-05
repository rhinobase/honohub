import { HistoryAction } from "../types";

export function getActionPerformed(action: HistoryAction) {
  switch (action) {
    case HistoryAction.CREATE:
      return { label: "Created", color: "success" };
    case HistoryAction.UPDATE:
      return { label: "Updated", color: "primary" };
    case HistoryAction.DELETE:
      return { label: "Deleted", color: "error" };
    case HistoryAction.ACTION:
      return { label: "Action", color: "secondary" };
    default:
      return {
        label: "Don't know what happened here 😅",
        color: "secondary",
      };
  }
}
