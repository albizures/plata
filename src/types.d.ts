export declare type Child = string | number | boolean | HTMLElement | HTMLElement[];
export declare type Children = Child | Child[];
export declare type Styles = Partial<CSSStyleDeclaration>;
export declare type Component<P = {}> = (props: P & {
    children?: Children;
}) => HTMLElement;
declare type TargetEvent<E, T> = Omit<E, "target"> & {
    target: T;
};
export declare type HEvent<T> = TargetEvent<Event, T>;
export declare type HMouseEvent<T> = TargetEvent<MouseEvent, T>;
export declare type HChangeEvent<T> = HEvent<T>;
export interface EventHandlers<T> {
    onChange?: (event: HChangeEvent<T>) => void;
    onClick?: (event: HEvent<T>) => void;
}
export interface Ref<T = null> {
    current: T | null;
    onReady: (handler: () => void) => void;
}
export declare type ElementNames = keyof HTMLElementTagNameMap;
export declare type Attributes<T> = Partial<Omit<T, "children">> & {
    children?: Children;
    ref?: Ref<T>;
} & EventHandlers<T>;
export declare type Elements = {
    [P in ElementNames]: Attributes<HTMLElementTagNameMap[P]>;
};
declare global {
    namespace JSX {
        interface IntrinsicElements extends Elements {
        }
        interface Element extends HTMLElement {
        }
        interface IntrinsicAttributes {
            key?: any;
        }
    }
}
export {};
