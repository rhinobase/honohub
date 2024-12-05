"use client";
import { ActionSelect as SharedActionSelect } from "@honohub/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useActionDialog } from "../../providers";
import { useCollectionActions } from "../../queries";
import { endpoint, handleError } from "../../utils";

export type ActionSelect = {
  selectedRows?: Record<string, unknown>[];
  onActionComplete: () => void;
  actionApiUrl: string;
  dataQueryKey: unknown[];
};

export function ActionSelect({
  selectedRows,
  onActionComplete,
  actionApiUrl,
  dataQueryKey,
}: ActionSelect) {
  const { setAction } = useActionDialog();

  const {
    data: actions,
    isLoading,
    isError,
  } = useCollectionActions(actionApiUrl);

  const queryClient = useQueryClient();

  const actionsWithIcon = useMemo(
    () =>
      actions?.map((action, index) => {
        const component = (
          <span
            key={`${action.name}-${index}`}
            className="material-icons-round !text-base"
          >
            {action.icon}
          </span>
        );

        return {
          ...action,
          icon: component,
        };
      }),
    [actions],
  );

  const { mutateAsync } = useMutation({
    mutationFn: (name: string) => {
      const documents = selectedRows?.map(({ _id }) => _id);

      return endpoint.post(actionApiUrl, {
        name,
        documents,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dataQueryKey,
      });
      toast.success("Action executed successfully.");
    },
    onError: (err) => handleError(err),
    onSettled: () => onActionComplete(),
  });

  const handler = useCallback<SharedActionSelect["handler"]>(
    (name) => {
      const action = actions?.find((action) => action.name === name);

      if (!action) throw new Error(`Unable to find ${name} action`);

      const actionHandler = async () => await mutateAsync(action.name);

      if (action.level) {
        let actionPropmt = {
          title: `Confirm ${action.label ?? action.name} Action`,
          message: "Are you sure you want to perform this action?",
        };

        if (typeof action.level !== "boolean") actionPropmt = action.level;

        setAction({
          ...actionPropmt,
          show: true,
          event: actionHandler,
        });
      } else actionHandler();
    },
    [mutateAsync, actions, setAction],
  );

  return (
    <SharedActionSelect
      actions={actionsWithIcon}
      handler={handler}
      isError={isError}
      isLoading={isLoading}
    />
  );
}
