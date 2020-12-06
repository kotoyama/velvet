import { RefReactive, ReactivePrimitive } from "./ref";
import { watchEffect } from "./effect";

interface Mutable<T> {
  get(): T;
  set(t: T): void;
}

type Getter<T> = () => T;
type Computable<T> = Getter<T> | Mutable<T>;
type Computed<T> = RefReactive<Readonly<T>>;

export function computed<T extends ReactivePrimitive>(
  t: Getter<T>
): Readonly<Computed<T>>;

export function computed<T extends ReactivePrimitive>(
  t: Mutable<T>
): Computed<T>;

export function computed<T extends ReactivePrimitive>(
  t: Computable<T>
): Computed<T> | Readonly<Computed<T>> {
  let value: T;

  if (isGetter(t)) {
    watchEffect(() => {
      value = t();
    });
    return {
      get value(): T {
        return value;
      },
    };
  } else {
    watchEffect(() => {
      value = t.get();
    });
    const update = (v: T) => t.set(v);
    return {
      get value(): T {
        return value;
      },
      set value(v: T) {
        update(v);
      },
    };
  }
}

function isGetter<T>(t: Computable<T>): t is Getter<T> {
  return typeof t === "function";
}
