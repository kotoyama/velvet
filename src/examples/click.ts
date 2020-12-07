import { h, mount, patch } from "vnode";
import { Children, VNode } from "vnode/types";
import { reactive } from "reactivity/reactive";
import { watchEffect } from "reactivity/effect";

const Button = (text: string, onclick: () => string | number) => {
  return h("button", { onclick }, text);
};

const ClickView = (): void => {
  const render = (clickCount: Children) =>
    h("div", { class: "container3" }, [
      h("h1", null, clickCount),
      h("p", null, "clicks"),
      Button("+1", () => (state.count += 1)),
      Button("-1", () => (state.count -= 1)),
    ]);

  const state = reactive({
    count: 0,
  });

  let previousNode: VNode | null = null;
  const app = document.getElementById("app");

  watchEffect(() => {
    if (!previousNode) {
      previousNode = render(`${state.count}`);
      mount(previousNode, app);
    } else {
      const newNode = render(`${state.count}`);
      patch(previousNode, newNode);
      previousNode = newNode;
    }
  });
};

export default ClickView;
