import { Avatar, Table, TableBody, Tag, Td, Tr } from "@rafty/ui";
import dayjs from "dayjs";
import type { StorageDataType } from "../../types";
import { formatBytes } from "../../utils";

export function PropertiesTable(props: StorageDataType) {
  let name = props.public_id;

  if (props.format) name += `.${props.format}`;

  return (
    <>
      <h3 className="mb-5 text-xl">Content Properties</h3>
      <Table variant="striped">
        <TableBody>
          <Tr>
            <Td>Type</Td>
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
            <Td>{name}</Td>
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
