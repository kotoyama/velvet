type Effect = () => void;

let activeEffect: Effect | null = null;

export const watchEffect = (effect: () => void): void => {
  activeEffect = effect;
  effect();
  activeEffect = null;
};

export interface Dependency {
  depend(): void;
  notify(): void;
}

export class ReactiveDependency implements Dependency {
  private subscribers = new Set<Effect>();

  depend(): void {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify(): void {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}
