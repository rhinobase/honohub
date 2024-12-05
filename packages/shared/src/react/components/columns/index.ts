import type { HeaderType } from "../../types";
import { ActivityAction } from "./ActivityAction";
import { ActivityCollectionLink } from "./ActivityCollectionLink";
import { ActivityDocument } from "./ActivityDocument";
import { ActivityOrganisationLink } from "./ActivityOrganisationLink";
import { ArrayCell } from "./Array";
import { BooleanCell } from "./Boolean";
import { CollectionActionCell } from "./CollectionAction";
import { ColorCell } from "./Color";
import { DateCell } from "./Date";
import { DatetimeCell } from "./Datetime";
import { DefaultCell } from "./Default";
import { IconCell } from "./Icon";
import { ImageCell } from "./Image";
import { ManageActionCell } from "./ManageAction";
import { ObjectCell } from "./Object";
import { RelationCell } from "./Relation";
import { SimpleCell } from "./Simple";
import { UserProfileCell } from "./UserProfile";

export type TableColumnType =
  | HeaderType["type"]
  | "default"
  | "__collection_action"
  | "__manage_action"
  | "__activity_document"
  | "__activity_action"
  | "__activity_organisation_link"
  | "__activity_collection_link"
  | "__color"
  | "__icon";

export const COLUMN_HEADER_COMPONENTS: Record<
  TableColumnType,
  () => JSX.Element | string
> = {
  string: SimpleCell,
  number: SimpleCell,
  datetime: DatetimeCell,
  date: DateCell,
  image: ImageCell,
  video: ImageCell,
  file: ImageCell,
  reference: RelationCell,
  boolean: BooleanCell,
  array: ArrayCell,
  user: UserProfileCell,
  object: ObjectCell,
  default: DefaultCell,
  pin: SimpleCell,
  __collection_action: CollectionActionCell,
  __manage_action: ManageActionCell,
  __activity_document: ActivityDocument,
  __activity_action: ActivityAction,
  __activity_organisation_link: ActivityOrganisationLink,
  __activity_collection_link: ActivityCollectionLink,
  __color: ColorCell,
  __icon: IconCell,
};
