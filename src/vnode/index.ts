import { Children, MountedVNode, Props, Tag, VNode } from "./types";

export interface NodeContainer {
  appendChild(el: HTMLElement): void;
}

export function h(tag: Tag, props: Props | null, children: Children): VNode {
  return VNode.valueOf(tag, props, children);
}

export function mount(vNode: VNode, container: NodeContainer): void {
  const el = vNode.recreateDOM().el;
  Object.entries(vNode.props).forEach(([name, value]) =>
    el.setAttribute(name, value)
  );
  if (typeof vNode.children === "string") {
    el.textContent = vNode.children;
  } else {
    vNode.children.forEach((child) => mount(child, el));
  }
  container.appendChild(el);
}

export function unmount(vNode: MountedVNode): void {
  const parent = vNode.el.parentNode;
  if (parent) {
    parent.removeChild(vNode.el);
  } else {
    throw new Error(`Parent for ${JSON.stringify(vNode)} was not found`);
  }
}

export function patch(n1: MountedVNode, n2: MountedVNode): void {
  const el = (n2.el = n1.el);

  if (!el.parentNode) {
    throw new Error(`Parent of ${n1} was not found`);
  }

  if (n1.sameTagWith(n2)) {
    mount(n2, el.parentNode);
    unmount(n1);
    return;
  }

  if (typeof n2.children === "string") {
    el.textContent = n2.children;
    return;
  }

  const c2 = n2.children;

  if (typeof n1.children === "string") {
    c2.forEach((c) => patch(n1, c));
    return;
  }

  const c1 = n1.children;
  const commonLength = Math.min(c1.length, c2.length);

  for (let i = 0; i < commonLength; i++) {
    patch(c1[i], c2[i]);
  }

  if (c2.length < c1.length) {
    c1.slice(c2.length).forEach(unmount);
  }

  if (c1.length < c2.length) {
    c2.slice(c1.length).forEach((c) => mount(c, el));
  }
}
