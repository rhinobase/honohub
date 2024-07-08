export type Promisify<T> = T | Promise<T>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

// Extracts the type of values of an object
export type ValueOf<T> = T[keyof T];
