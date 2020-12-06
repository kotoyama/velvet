import { h, mount, patch } from "vnode";

const node1 = h("div", { class: "container" }, [
  h("div", null, "🦄"),
  h("span", null, "hello"),
  h("span", null, "world"),
]);

const node2 = h("div", { class: "container" }, [
  h("h1", null, "Hi 🦄"),
  h("p", null, [h("span", null, "Lol"), h("span", null, " kek")]),
  h(
    "img",
    {
      src:
        "https://media1.giphy.com/media/AWqRqyyLYhZxS/giphy.gif?cid=ecf05e47cddjxop15fw2wyvrhwtmyclfhb79cd582avd4ztw&rid=giphy.gif",
      style: "width: 350px; border-radius: 0.5rem;",
    },
    []
  ),
]);

const app = document.getElementById("app");

if (app) {
  mount(node1, app);
  setTimeout(() => {
    patch(node1, node2);
  }, 3000);
} else {
  throw new Error("app not found");
}
