"use client";
import { CollectionPermission, useCollection } from "@honohub/shared";
import {
  Checkbox,
  TreeView,
  TreeViewContent,
  TreeViewItem,
  TreeViewLabel,
  useFieldControlContext,
} from "@rafty/ui";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

type PermissionValueType = {
  collection: { _type: string; _ref: string; title: string };
  create: boolean;
  delete: boolean;
  list: boolean;
  update: boolean;
  view: boolean;
}[];

export function CollectionsPermissionsField() {
  const { collections = [] } = useCollection();
  const { control, setValue } = useFormContext();
  const { name } = useFieldControlContext();

  const value: PermissionValueType = useWatch({ control, name }) ?? [];

  const permissions = useMemo(
    () =>
      collections.map((col) => ({
        collection: { id: col._id, title: col.name.singular, slug: col.slug },
        [CollectionPermission.CREATE]: false,
        [CollectionPermission.DELETE]: false,
        [CollectionPermission.LIST]: false,
        [CollectionPermission.UPDATE]: false,
        [CollectionPermission.VIEW]: false,
      })),
    [collections],
  );

  return (
    <div className="border rounded-lg border-secondary-200 dark:border-secondary-800 p-2">
      <TreeView size="lg">
        {permissions.map(({ collection, ...permission }) => {
          const currentCol = value.find(
            (item) => item.collection._ref === collection.id,
          );

          let isAllChecked = false;

          if (currentCol) {
            const { collection: col, ...perm } = currentCol;

            isAllChecked = Object.values(perm).every((value) => value === true);
          }

          return (
            <TreeViewItem key={collection.id} value={collection.id}>
              <TreeViewLabel className="[&>span]:w-full">
                <div className="flex items-center gap-2 w-full relative">
                  <Checkbox
                    checked={isAllChecked}
                    onCheckedChange={(check: boolean) => {
                      const temp = value;

                      const index = value.findIndex(
                        (item) => item.collection._ref === collection.id,
                      );
                      if (index >= 0) {
                        temp[index].create = check;
                        temp[index].delete = check;
                        temp[index].list = check;
                        temp[index].update = check;
                        temp[index].view = check;
                      } else {
                        temp.push({
                          collection: {
                            _ref: collection.id,
                            _type: "collections",
                            title: collection.slug,
                          },
                          create: check,
                          delete: check,
                          list: check,
                          update: check,
                          view: check,
                        });
                      }
                      setValue(name, temp);
                    }}
                  />
                  <p className="text-secondary-800 dark:text-secondary-200 select-none font-medium leading-snug">
                    {collection.title}
                    <span className="pl-1 text-xs italic text-secondary-500 dark:text-secondary-400">
                      ({collection.slug})
                    </span>
                  </p>
                </div>
              </TreeViewLabel>
              <TreeViewContent>
                {Object.keys(permission).map((item) => {
                  const val = `${collection.id}.${item}`;
                  return (
                    <TreeViewItem key={val} value={val}>
                      <TreeViewLabel className="[&>span]:w-full relative">
                        <Checkbox
                          // @ts-expect-error
                          checked={isAllChecked || !!currentCol?.[item]}
                          onCheckedChange={(check: boolean) => {
                            const temp = value;

                            const index = value.findIndex(
                              (item) => item.collection._ref === collection.id,
                            );
                            if (index >= 0) {
                              // @ts-expect-error
                              temp[index][item] = check;
                            } else {
                              temp.push({
                                collection: {
                                  _ref: collection.id,
                                  _type: "collections",
                                  title: collection.slug,
                                },
                                // @ts-expect-error
                                item: check,
                              });
                            }
                            setValue(name, temp);
                          }}
                        />
                        <p className="capitalize text-secondary-800 dark:text-secondary-200 select-none font-medium text-sm leading-snug">
                          {item}
                        </p>
                      </TreeViewLabel>
                    </TreeViewItem>
                  );
                })}
              </TreeViewContent>
            </TreeViewItem>
          );
        })}
      </TreeView>
    </div>
  );
}
