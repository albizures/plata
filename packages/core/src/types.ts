export type Child = string | number | boolean | HTMLElement | HTMLElement[];
export type Children = Child | Child[];
export type Styles = Partial<CSSStyleDeclaration>;

export type Component<P = {}> = (
	props: P & { children?: Children },
) => HTMLElement;

type TargetEvent<E, T> = Omit<E, 'target'> & {
	target: T;
};

export type PEvent<T> = TargetEvent<Event, T>;
export type PMouseEvent<T> = TargetEvent<MouseEvent, T>;
export type PChangeEvent<T> = PEvent<T>;

export type EventHandler<T> = (event: PEvent<T>) => unknown;
export type MouseEventHandler<T> = (event: PMouseEvent<T>) => unknown;
export type ChangeEventHandler<T> = (event: PChangeEvent<T>) => unknown;

export type OnReady = <T>(ref: T) => void;
export interface Ref<T = null> {
	current: T | null;
	handlers: OnReady[];
}

export type ElementNames = keyof HTMLElementTagNameMap;
export type Attributes<T> = Partial<Omit<T, 'children' | 'styles'>> & {
	children?: Children;
	styles?: Styles;
	ref?: Ref<T>;
};

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
