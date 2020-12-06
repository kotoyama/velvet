export class VNode {
  static valueOf(tag: Tag, props: Props | null, children: Children): VNode {
    return new VNode(tag, props || {}, children);
  }

  public _el: HTMLElement | null = null;

  private constructor(
    readonly tag: Tag,
    readonly props: Props,
    readonly children: Children
  ) {}

  get el(): HTMLElement {
    return this._el || (this._el = this.createElement());
  }

  set el(el: HTMLElement) {
    this._el = el;
  }

  recreateDOM(): this {
    this._el = this.createElement();
    return this;
  }

  sameTagWith(other: VNode): boolean {
    return this.tag === other.tag;
  }

  private createElement(): HTMLElement {
    return document.createElement(this.tag);
  }
}

export interface MountedVNode extends VNode {
  el: HTMLElement;
  children: MountedChildren;
}

export type Tag = string;
export type Props = {
  [propName: string]: any;
};
export type Children = VNode[] | string;
export type MountedChildren = MountedVNode[] | string;
