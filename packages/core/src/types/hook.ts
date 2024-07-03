import type { Context, Env, Input } from "hono";
import type { AccessType } from "../utils";

export type CollectionHooks = {
  beforeOperation: CollectionBeforeOperationHook[];
  beforeValidate: DeafultCollectionsHook[];
  beforeDelete: DeafultCollectionsHook[];
  beforeChange: DeafultCollectionsHook[];
  beforeRead: DeafultCollectionsHook[];
  afterChange: DeafultCollectionsHook[];
  afterRead: DeafultCollectionsHook[];
  afterDelete: DeafultCollectionsHook[];
  afterOperation: CollectionAfterOperationHook[];
};

export type DeafultCollectionsHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: { context: Context<E, P, I> }) => void;

export type CollectionBeforeOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: { context: Context<E, P, I>; access_type: AccessType }) => void;

export type CollectionAfterOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: { context: Context<E, P, I>; access_type: AccessType }) => void;
