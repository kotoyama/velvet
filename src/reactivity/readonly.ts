export const readonly = <T extends Record<string, unknown>>(target: T): T => {
  return new Proxy(target, {
    set() {
      throw new Error(`Overwrite is not allowed because it is readonly`);
    },
  });
};
