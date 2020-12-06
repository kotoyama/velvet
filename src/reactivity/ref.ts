import { reactive } from "./reactive";

export type ReactivePrimitive = number | string | unknown[] | boolean;
export type RefReactive<T> = { value: T };

export function ref<T extends ReactivePrimitive>(value: T): RefReactive<T> {
  return reactive({ value });
}
