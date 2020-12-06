import { ReactiveDependency } from "./effect";

export type CanReactive = { [key: string]: unknown };

export const reactive = <T extends CanReactive>(obj: T): T => {
  const depsMap = new DependencyMap<T>();

  return new Proxy(obj, {
    get(target, prop: keyof T) {
      depsMap.dependTo(prop);
      return target[prop];
    },
    set(target, prop: keyof T, newValue) {
      if (target[prop] === newValue) return true;
      target[prop] = newValue;
      depsMap.notifyTo(prop);
      return true;
    },
  });
};

class DependencyMap<T> {
  private map: { [key: string]: ReactiveDependency } = {};

  dependTo(key: keyof T) {
    const prop = key as string;
    const dep = this.map[prop]
      ? this.map[prop]
      : (this.map[prop] = new ReactiveDependency());
    dep.depend();
  }

  notifyTo(key: keyof T) {
    const prop = key as string;
    const dep = this.map[prop];
    dep.notify();
  }
}
