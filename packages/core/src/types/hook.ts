import type { Context, Env, Input } from "hono";
import type { AccessType } from "../utils";

export type CollectionHooks = {
  beforeOperation: CollectionBeforeOperationHook[];
  // beforeValidate: any[];
  // beforeDelete: any[];
  // beforeChange: any[];
  // beforeRead: any[];
  // afterChange: any[];
  // afterRead: any[];
  // afterDelete: any[];
  afterOperation: CollectionAfterOperationHook[];
};

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
