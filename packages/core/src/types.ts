export type Child = string | number | boolean | HTMLElement | HTMLElement[];
export type Children = Child | Child[];
export type Styles = Partial<CSSStyleDeclaration>;

export type Component<P = {}> = (
	props: P & { children?: Children },
) => HTMLElement;

type TargetEvent<E, T extends HTMLElement> = Omit<E, 'target'> & {
	target: T;
};

export type PEvent<T extends HTMLElement> = TargetEvent<Event, T>;
export type PMouseEvent<T extends HTMLElement> = TargetEvent<MouseEvent, T>;
export type PChangeEvent<T extends HTMLElement> = PEvent<T>;

export interface EventHandlers<T extends HTMLElement> {
	onChange?: (event: PChangeEvent<T>) => void;
	onClick?: (event: PEvent<T>) => void;
}

export type EventHandler<T extends HTMLElement> = (event: PEvent<T>) => unknown;
export type MouseEventHandler<T extends HTMLElement> = (
	event: PMouseEvent<T>,
) => unknown;
export type ChangeEventHandler<T extends HTMLElement> = (
	event: PChangeEvent<T>,
) => unknown;

export type OnReady = <T>(ref: T) => void;
export interface Ref<T = null> {
	current: T | null;
	handlers: OnReady[];
}

type OmittedAttr = 'children' | 'styles' | 'onchange' | 'onclick';

export type ElementNames = keyof HTMLElementTagNameMap;
export type Attributes<T extends HTMLElement> = Partial<
	Omit<T, OmittedAttr>
> & {
	children?: Children;
	styles?: Styles;
	ref?: Ref<T>;
} & EventHandlers<T>;

export type Plugin = <E extends ElementNames>(
	element: HTMLElementTagNameMap[E],
	props: Attributes<HTMLElementTagNameMap[E]>,
) => void;

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
