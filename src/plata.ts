import {
  Child,
  Children,
  Component,
  Ref,
  Styles,
  ElementNames,
  Elements,
  EventHandlers,
  HEvent,
  HMouseEvent,
  HChangeEvent
} from "./types";

const addEventHandler = <T extends ElementNames>(
  element: HTMLElement,
  props: Props<T>,
  name: string,
  customName: string
) => {
  if (props && props[customName]) {
    element.addEventListener(name, props[customName]);
    Reflect.deleteProperty(props, customName);
  }
};

type Props<T extends ElementNames> = Partial<HTMLElementTagNameMap[T]> &
  EventHandlers<HTMLElementTagNameMap[T]> & {
    ref?: Ref<HTMLElementTagNameMap[T]>;
  };

const initRef = <T extends ElementNames>(
  element: HTMLElementTagNameMap[T],
  props: Elements[T]
) => {
  if (!props || !props.ref) {
    return;
  }

  props.ref.current = element;
};

const create = <E extends ElementNames, C extends Component>(
  name: E | C,
  props: Elements[E] | Parameters<C>[0],
  ...children: Child[]
): HTMLElement => {
  if (typeof name === "function") {
    return name({
      ...props,
      children
    });
  }

  const attr = props as Elements[E];

  const element = document.createElement(name);

  addEventHandler(element, attr, "change", "onChange");
  addEventHandler(element, attr, "click", "onClick");

  appendChild(element, children);
  initRef(element, attr);

  Object.assign(element, props);

  return element;
};

const render = (element: HTMLElement, parent: HTMLElement) => {
  parent.appendChild(element);
};

const appendChild = (element: HTMLElement, children: Children) => {
  if (Array.isArray(children)) {
    children.forEach(child => {
      appendChild(element, child);
    });
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  } else if (typeof children !== "boolean") {
    element.appendChild(document.createTextNode(String(children)));
  }
};

const setStyles = <T extends HTMLElement>(ref: Ref<T>, styles: Styles) => {
  if (ref.current) {
    Object.assign(ref.current.style, styles);
  } else {
    ref.onReady(() => setStyles(ref, styles));
  }
};

const append = <T extends HTMLElement>(ref: Ref<T>, children: Children) => {
  if (ref.current) {
    appendChild(ref.current, children);
  } else {
    ref.onReady(() => appendChild(ref.current, children));
  }
};

const remove = <T extends HTMLElement>(ref: Ref<T>) => {
  if (ref.current) {
    ref.current.remove();
  } else {
    ref.onReady(() => remove(ref));
  }
};

const replaceContent = <T extends HTMLElement>(
  ref: Ref<T>,
  children: Children
) => {
  if (ref.current) {
    ref.current.innerHTML = "";
    appendChild(ref.current, children);
  } else {
    ref.onReady(() => replaceContent(ref, children));
  }
};

const createRef = <T = null>(): Ref<T> => {
  const handlers = [];
  let value: T = null;
  return {
    set current(newValue: T) {
      if (value === null) {
        value = newValue;
        handlers.forEach(handler => {
          try {
            handler();
          } catch (error) {
            console.log(error);
          }
        });

        handlers.length = 0;
      } else {
        value = newValue;
      }
    },
    get current() {
      return value;
    },
    onReady(handler: () => void) {
      handlers.push(handler);
    }
  };
};

export * from "./types";
export type MouseEvent<T> = HMouseEvent<T>;
export type EventChange<T> = HChangeEvent<T>;
export type Event<T> = HEvent<T>;
export { render, replaceContent, remove, setStyles, create, createRef, append };
