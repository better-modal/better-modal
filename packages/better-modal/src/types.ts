export type Prettify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
