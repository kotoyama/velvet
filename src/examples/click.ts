import { h, mount, patch } from "vnode";
import { Children, VNode } from "vnode/types";
import { reactive } from "reactivity/reactive";
import { watchEffect } from "reactivity/effect";

const render = (clickCount: Children) =>
  h("div", { class: "container" }, [
    h("h1", null, clickCount),
    h("p", null, "clicks"),
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
