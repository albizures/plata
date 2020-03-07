export type Handler<T> = (value: T) => unknown;

export type ObservableWatcher<T> = (
	newValue: T | null,
	oldValue: T | null,
) => void;
export interface Observable<T> {
	watch: (handler: ObservableWatcher<T>) => void;
	value: T;
}

export interface CustomSupportedType<T> {
	checkType: (child: unknown) => child is T;
	parser: (child: T, parent: HTMLElement) => Promise<Node[]>;
}

export type SimpleChild = string | number | boolean | Node;
export type ObservableValues = SimpleChild | SimpleChild[] | PlataElement;
export type ObservableChild = Observable<ObservableValues>;
export type Child = ObservableChild | SimpleChild | PlataElement;

export type Children = Child[];
export type FlattedChild = ObservableChild | SimpleChild;
export type Styles = Partial<CSSStyleDeclaration>;

export type PlataElement = Promise<Node | Node[]>;

export type Component<P = {}> = (
	props: { children?: Children } & P,
) => PlataElement;

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
		type Element = PlataElement;
		interface IntrinsicElements extends Elements {}
		interface IntrinsicAttributes {
			key?: any;
		}
	}
}
