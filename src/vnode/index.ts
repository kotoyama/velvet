import { Children, MountedVNode, Props, Tag, VNode } from "./types";

export interface NodeContainer {
  appendChild(el: HTMLElement): void;
}

// create a virtual node (but dont mount it)
export function h(tag: Tag, props: Props | null, children: Children): VNode {
  return VNode.valueOf(tag, props, children);
}

// mount a virtual node to the DOM
export function mount(vNode: VNode, container: NodeContainer): void {
  const el = vNode.recreateDOM().el;
  Object.entries(vNode.props).forEach(([name, value]) =>
    el.setAttribute(name, value)
  );
  patchProps(el, {}, vNode.props);
  if (typeof vNode.children === "string") {
    el.textContent = vNode.children;
  } else {
    vNode.children.forEach((child) => mount(child, el));
  }
  container.appendChild(el);
}

// unmount vnode from the DOM
export function unmount(vNode: MountedVNode): void {
  const parent = vNode.el.parentNode;
  if (parent) {
    parent.removeChild(vNode.el);
  } else {
    throw new Error(`Parent for ${JSON.stringify(vNode)} was not found`);
  }
}

// takes 2 nodes, compares them and figures out the difference
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

export function listener(event: Event): EventListener {
  return this[event.type](event);
}

export function patchProp(
  node: HTMLElement,
  key: string,
  value: string,
  nextValue: string
): void {
  if (key.startsWith("on")) {
    const eventName = key.slice(2);
    (node as any)[eventName] = nextValue;

    if (!nextValue) {
      node.removeEventListener(eventName, listener);
    } else if (!value) {
      node.addEventListener(eventName, listener);
    }
    return;
  }
  if (!nextValue) {
    node.removeAttribute(key);
    return;
  }
  node.setAttribute(key, nextValue);
}

export function patchProps(
  node: HTMLElement,
  props: Props | null,
  nextProps: Props | null
): void {
  const mergedProps = { ...props, ...nextProps };
  Object.keys(mergedProps).forEach((key) => {
    if (props[key] !== nextProps[key]) {
      patchProp(node, key, props[key], nextProps[key]);
    }
  });
}
