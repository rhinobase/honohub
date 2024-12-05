"use client";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  Tag,
  Td,
  Tr,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { useEffect } from "react";
import type { StorageDataType } from "../../types";
import { formatBytes } from "../../utils";

export function PropertiesTable(props: StorageDataType) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useBoolean();

  let name = props.public_id;

  if (props.format) name += `.${props.format}`;

  useEffect(() => {
    if (!isCopied) return;

    // Use setTimeout to update the message after 1500 milliseconds (1.5 seconds)
    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [isCopied, setIsCopied]);

  const handleCopy = eventHandler(() => {
    copyToClipboard(name);
    setIsCopied(true);
  });

  return (
    <>
      <h3 className="mb-5 text-xl">Content Properties</h3>
      <Table variant="striped" className="[&>table]:table-fixed">
        <TableBody>
          <Tr>
            <Td className="w-[130px]">Type</Td>
            <Td>{props.resource_type}</Td>
          </Tr>
          <Tr>
            <Td>Size</Td>
            <Td>{formatBytes(props.bytes)}</Td>
          </Tr>
          {props.width && props.height && (
            <Tr>
              <Td>Width x Height</Td>
              <Td>
                {props.width} x {props.height}
              </Td>
            </Tr>
          )}
          <Tr>
            <Td>Location</Td>
            <Td>
              <div className="flex items-center w-full gap-1">
                <p className="w-full truncate">{name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  onKeyDown={handleCopy}
                >
                  {isCopied ? (
                    <CheckIcon className="size-4 stroke-2 stroke-green-500 dark:stroke-green-300" />
                  ) : (
                    <DocumentDuplicateIcon className="size-4" />
                  )}
                </Button>
              </div>
            </Td>
          </Tr>
          <Tr>
            <Td>Created By</Td>
            <Td>
              {props.created_by && (
                <Tag className="flex items-center gap-1.5 rounded-full p-1 pr-2 font-normal">
                  <Avatar
                    name={props.created_by.displayName}
                    className="size-7"
                  />
                  {props.created_by.displayName}
                </Tag>
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>Created At</Td>
            <Td>{dayjs(props.created_at).format("DD MMM YYYY, hh:MM A")}</Td>
          </Tr>
        </TableBody>
      </Table>
    </>
  );
}
