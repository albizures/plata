export type Child = string | number | boolean | HTMLElement | HTMLElement[];
export type Children = Child | Child[];
export type Styles = Partial<CSSStyleDeclaration>;

export type Component<P = {}> = (
  props: P & { children?: Children }
) => HTMLElement;

type TargetEvent<E, T> = Omit<E, "target"> & {
  target: T;
};

export type HEvent<T> = TargetEvent<Event, T>;
export type HMouseEvent<T> = TargetEvent<MouseEvent, T>;
export type HChangeEvent<T> = HEvent<T>;

export interface EventHandlers<T> {
  onChange?: (event: HChangeEvent<T>) => void;
  onClick?: (event: HEvent<T>) => void;
}

export interface Ref<T = null> {
  current: T | null;
  onReady: (handler: () => void) => void;
}

export type ElementNames = keyof HTMLElementTagNameMap;
export type Attributes<T> = Partial<Omit<T, "children">> & {
  children?: Children;
  ref?: Ref<T>;
} & EventHandlers<T>;

export type Elements = {
  [P in ElementNames]: Attributes<HTMLElementTagNameMap[P]>;
};

declare global {
  namespace JSX {
    export interface IntrinsicElements extends Elements {}
    export interface Element extends HTMLElement {}
    export interface IntrinsicAttributes {
      key?: any;
    }
  }
}
