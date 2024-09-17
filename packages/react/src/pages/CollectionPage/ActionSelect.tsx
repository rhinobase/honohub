import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import { ActionSelect as SharedActionSelect } from "@honohub/shared";
import { Toast } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Suspense, lazy, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useDialogManager, useServer } from "../../providers";
import type { CollectionType } from "../../types";

export type ActionSelect<T> = {
  selectedRows: T[];
  slug: string;
  onActionComplete: () => void;
} & Pick<CollectionType, "slug" | "actions">;

export function ActionSelect<T>({
  selectedRows,
  slug,
  onActionComplete,
  actions,
}: ActionSelect<T>) {
  const { endpoint } = useServer();
  const queryClient = useQueryClient();
  const { action: actionDialogManager } = useDialogManager();

  const actionsWithIcon = useMemo(
    () =>
      actions.map((action, index) => {
        let component = (
          <BoltIcon key={`${action.name}-${index}`} className="size-4" />
        );

        const actionIcon = action.icon;

        if (actionIcon != null) {
          const Icon = lazy(() =>
            import("@heroicons/react/24/outline").then((mod) => ({
              default: mod[actionIcon] as typeof BoltIcon,
            })),
          );

          component = (
            <Suspense fallback={"loading..."}>
              <Icon className="size-4" />
            </Suspense>
          );
        }

        return {
          ...action,
          icon: component,
        };
      }),
    [actions],
  );

  const { mutate: fireAction } = useMutation({
    mutationFn: (action: string) =>
      endpoint.post(`/collections/${slug}/actions/${action}`, {
        items: selectedRows,
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collections", slug] });

      toast.custom(({ visible }) => (
        <Toast
          severity="success"
          title="Action executed successfully."
          visible={visible}
        />
      ));
    },
    onError: (err, action) => {
      console.error(err);

      if (isAxiosError(err)) {
        toast.custom(({ visible }) => (
          <Toast
            severity="error"
            title={`${err.response?.status} ${err.code}`}
            message={err.response?.statusText}
            visible={visible}
          />
        ));
      } else
        toast.custom(({ visible }) => (
          <Toast
            severity="error"
            title={`Unable to run action - ${action}`}
            visible={visible}
          />
        ));
    },
    onSettled: () => onActionComplete(),
  });

  const handler = useCallback<SharedActionSelect["handler"]>(
    (name) => {
      const action = actions.find((action) => action.name === name);

      if (!action) throw new Error(`Unable to find ${name} action`);

      const actionHandler = () => fireAction(action.name);

      if (action.level) {
        let actionPropmt = {
          title: `Confirm ${action.label ?? action.name} Action`,
          message: "Are you sure you want to perform this action?",
        };

        if (typeof action.level !== "boolean") actionPropmt = action.level;

        actionDialogManager.setState({
          ...actionPropmt,
          show: true,
          action: actionHandler,
        });
      } else actionHandler();
    },
    [actions, fireAction, actionDialogManager],
  );

  return <SharedActionSelect handler={handler} actions={actionsWithIcon} />;
}
